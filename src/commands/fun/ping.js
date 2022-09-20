const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');

function jsonRead(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(content));
          } catch (err) {
            reject(err);
          }
        }
      });
    });
}

module.exports = {
    name: 'ping',
    data : new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Send Pong ! Use for test"),
    async execute(interation) {
        const config = await jsonRead(filePath);
        if (config.stateModuleFun === 'OFF'){
            interation.reply('**[❌]** **ERROR**: Fun module is disabled !')
        } else {
        interation.reply("Pong !");
        }
    }
}
