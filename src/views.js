module.exports = class Views {
  constructor(bot) {
    this.bot = bot;
  }

  keyboardGenerator(keys){
    keys = keys.map(row => {
      return row.map(button => {
        return this.bot.inlineButton(button.text, { callback: button.callback })
      })
    });
    return this.bot.inlineKeyboard(keys);
  }

  arrayToGrid(obj, columns){
    let out = [], row=[], i=0;
    obj.forEach((v,count)=>{
      if(i===columns){
        out.push(row);
        i=0; row=[];
      }
      row.push(v);
      i++;
      if(count===obj.length-1) out.push(row);
    });
    return out;
  }

  sendMessage(to, text, params, keyboard){
    params = params || {};
    params.markup = params.markup || keyboard;
    this.bot.sendMessage(to, text, params);
  }

}
