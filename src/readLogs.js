const fs = require('fs');
const path = require('path');
const lokijs = require('lokijs');
const ta = require('time-ago');
const Table = require('cli-table');

let collection;
let db = new lokijs(path.join(__dirname, "../db/loki.json"), {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  autoloadCallback: () => {
    collection = db.getCollection("main") || db.addCollection("main");

    let res = collection.chain()
      .limit(100)
      .data();

    let table = new Table({
      head: ["id", "username", "lang", "request", "time"]
    });

    res
      .map(v => ({
        id: v["$loki"],
        time: ta.ago(v.timestamp),
        username: v.data[0].username || "",
        language: v.data[0].language_code || "",
        request: v.data[1] || ""
      }))
      .forEach(v => {
        table.push([
          v.id || "",
          v.username || "",
          v.language || "",
          v.request || "",
          v.time || ""
        ]);
      });

    console.log(table.toString());
    process.exit();
  }
});
