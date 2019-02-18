const request = require('request');
const cachedRequest = require('cached-request')(request);
cachedRequest.setCacheDirectory(process.env.CACHE_DIR || "/tmp/cache");
cachedRequest.setValue('ttl', 1000*60*5);

class getPlanLinks{
  constructor() {

  }
  getData(url){
    return new Promise((resolve, reject) => {
      cachedRequest({url}, (err, res, body) => {
        if (err) throw err;
        else resolve(body);
      });
    });
  }
  parsePage(url){
    url = "http://sspu.ru"+url;
    return new Promise((resolve, reject) => {
      this.getData(url).then(body=>{
        body = body.toString();
        let links = [];
        let menus = body.match(/"\/r\/doc\/(.*?)" class="rasp_block_caption">(.*?)<\/a>/g);
        let pdfs = body.match(/<a href="\/r\/view\.html\?file=doc\/(.*?).PDF" target="_blank" class="rasp_block_caption">(.*?)<\/a>/g);

        if(menus) menus.forEach(v=>{
          links.push({
            url: v.match(/"(.*?)"/g)[0].slice(1,-1),
            title: v.match(/>(.*?)</g)[0].slice(1,-1),
            type: "link"
          });
        });
        if(pdfs) pdfs.forEach(v=>{
          links.push({
            url: v.match(/"(.*?)"/g)[0].slice(1,-1),
            title: v.match(/>(.*?)</g)[0].slice(1,-1),
            type: "pdf"
          });
        });
        resolve(links);


      });
    });
  };
}

module.exports = new getPlanLinks();
// http://sspu.ru/r/
