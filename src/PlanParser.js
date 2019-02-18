const fs = require('fs');
const download = require('download');
const pdf_table_extractor = require("pdf-table-extractor");
const logger = require('./logger');

const cachePath = process.env.CACHE_DIR || "/tmp/cache";

class PlanParser{
  constructor(){
  }
  extractPdf(url){
    return new Promise((resolve, reject) => {

      download("http://sspu.ru"+url.replace("view\.html\?file=",""), cachePath).then(data => {
        let path = cachePath + Date.now()+".pdf";
        fs.writeFileSync(path, data);
        pdf_table_extractor(path, pdf => {
          let tables;
          if (pdf.pageTables[0]) {
            tables = pdf.pageTables[0].tables;
          } else {
            resolve([]);
            return;
          }
          let group = tables[0][3];
          let title = tables[1][3];
          let plan = [], day = [], tempDate, tempDay;
          let planPush = () => {
            plan.push({
              date: tempDate.trim(),
              day: tempDay.trim(),
              tasks: day
            });
          }
          tables.slice(2).forEach(v=>{

            if(v[1]!==""){
              if(day.length > 1){
                planPush();
                day = [];
              }
              day.push({time: v[2].trim(), title: v[3]});
              tempDate = v[0];
              tempDay = v[1];
            }
            else day.push({time: v[2].trim(), title: v[3]});
          });
          planPush();
          fs.unlinkSync(path);

          resolve([group, title, plan]);
        }, err => {
          reject(err);
        });
      });

    });
  }

  printPlan(url){

    return new Promise((resolve, reject) => {

      this.extractPdf(url).then(([group, title, plan]) => {
        if(title && title !== ""){
          let out="";
          out += (`\n🎓 ${group}\n📄 ${title.replace("\n","\n  ")}\n---\n`);
          plan.forEach(day=>{
            out += (`\n<b>${day.day} [${day.date}]</b>\n`);
            day.tasks.forEach(task=>{
              if(task.title.trim()!==""){
                if(task.time.trim()==="") task.time="-";
                out += `  🕑 ${task.time}\n`;
                out += `    <i>${task.title.replace("\n","\n    ")}</i>\n`;
              }
            });
          });
          resolve(out);
        }
        else{
          resolve("nothing");
        }
      });

    });
  }
  errorHandler(err){
    logger(err);
  }

}

module.exports = new PlanParser();
