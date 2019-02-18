const fs = require('fs');
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, "../.env")
});

const TeleBot = require('telebot');

let botConf = {
  token: process.env.TG_TOKEN,
}

if (process.env.BOT_TYPE === "webhook") {
  botConf.webhook = {
    url: process.env.BOT_URL,
    host: process.env.BOT_HOST,
    port: process.env.BOT_PORT
  }
} else {
  botConf.polling = {
    interval: parseInt(process.env.BOT_POLLING_INTERVAL) || 1000,
    timeout: parseInt(process.env.BOT_POLLING_TIMEOUT) || 0,
    limit: parseInt(process.env.BOT_POLLING_LIMIT) || 100,
    retryTimeout: parseInt(process.env.BOT_POLLING_RETRYTIMEOUT) || 5000
  }
}

const bot = new TeleBot(botConf);

const PlanParser = require('./PlanParser.js');
const Views = require('./views');
const view = new Views(bot);
const logger = require('./logger');
const getPlanLinks = require('./getPlanLinks.js');


const navigation = (msg, url) => {
    getPlanLinks.parsePage(url).then(data=>{
      let keyboard = [
        ...view.arrayToGrid([...data.map((v,i)=>{
            return { text: v.title, callback:`${v.type}||${v.url}` }
          })],1)
      ];

      let markup = view.keyboardGenerator(keyboard);
      view.sendMessage(msg.from.id, "Расписания занятий Шуйского филиала ИвГУ",{
        parseMode: 'html',
        markup
      });
    });
}

bot.on('callbackQuery', msg => {
  logger(msg.from, msg.data);
  let [type,url] = msg.data.split("||");
  if(type === "link") navigation(msg, url)
  else {

    PlanParser.printPlan(url).then(out=>{

      if(out!=="nothing"){
        view.sendMessage(msg.from.id, out,{
          parseMode: 'html'
        });
      }
      else{
        bot.sendDocument(msg.from.id, "http://sspu.ru"+url.replace("view\.html\?file=",""))
      }
    })
  };
});

bot.on('/start', msg => {
  logger(msg.from, "start");
  let replyMarkup = bot.keyboard([['Расписание']], {resize: true});
  return bot.sendMessage(msg.from.id, `Выберите "Расписание", чтобы открыть выбор рассписания`, {replyMarkup});
});
bot.on(/^(?!\/start)(.+)/, msg => {
  logger(msg.from, msg.data);
  navigation(msg, "/r/");
});

bot.connect();
