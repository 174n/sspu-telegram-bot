const fs = require('fs');
const path = require('path');
const lokijs = require('lokijs');

let collection;
let db = new lokijs(path.join(__dirname, "../db/loki.json"), {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  autoloadCallback: () => {
    collection = db.getCollection("main") || db.addCollection("main");
  }
});

module.exports = (...params) => {

    let timestamp = Date.now();
    collection.insert({data:params,timestamp:timestamp});
    if (process.env.LOG_TO_CONSOLE) {
      console.log({data:params,timestamp:timestamp});
    }
}
