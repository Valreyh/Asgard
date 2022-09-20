const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');

// helper function to read the JSON file
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
  
// helper function to write the JSON file
 function jsonWrite(filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
}

module.exports = {
    name: 'activatemodule',
    cooldown: 20000,
    description: 'Activate a bot module',
    data: new SlashCommandBuilder()
        .setName('moduleactivate')
        .setDescription('Activate a module name')
        .addStringOption(modulename => modulename
            .setName('modulename')
            .setRequired(true)
            .setDescription('Activate a module name')
            .addChoice('Moderation', 'ModerationModule')
            .addChoice('Fun', 'FunModule')
        ),
    async execute(interaction){
        if (!interaction.member.permissions.has('MANAGE_GUILD') || !interaction.member.permissions.has('ADMINISTRATOR')){
          interaction.reply({
            content: "**[❌]** **ERROR**: You don't have the `MANAGE_SERVER` or `ADMNISTRATOR` permission !",
            ephemeral : true
          })
        } else {
        let name = interaction.options.getString('modulename');
        if(name === 'ModerationModule'){
            interaction.reply('**[🚨]** **CONFIG**: Moderation module is set to **ON**');
            const config = await jsonRead(filePath);
            config.stateModuleModeration = 'ON';
            jsonWrite(filePath, config);
        } else if ( name === 'FunModule'){
            interaction.reply('**[🚨]** **CONFIG**: Fun module is set to **ON**');
            const config = await jsonRead(filePath);
            config.stateModuleFun = "ON";
            jsonWrite(filePath, config);
        }
    }
}
}