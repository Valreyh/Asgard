const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');

// FONCTION POUR LIRE LE FICHIER CONFIG
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
  
// FONCTION POUR ECRIRE DANS LE FICHIER CONFIG
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
            embeds: [ new MessageEmbed()
              .setColor('RED')
              .setDescription('**[❌]** **ERROR**: You need the permission `MANAGE_GUILD` or `ADMINISTRATOR` to use this command !')
              .setFooter({
                text: "Asgard ⚖ | Link to fund."
          })],
            ephemeral : true
          })
        } else {
        let name = interaction.options.getString('modulename');
        if(name === 'ModerationModule'){
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(':shield: **Moderation module is now ACTIVATED 🟢**\n\nYou can see the help of this module by typing `/modulesinfo` and pressing the moderation help button.')
                .setFooter({
                  text:"Asgard ⚖ | Link to fund."})
                ]});
            const config = await jsonRead(filePath);
            config.stateModuleModeration = '🟢';
            jsonWrite(filePath, config);
        } else if ( name === 'FunModule'){
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(':video_game: **Fun module is now ACTIVATED 🟢**\n\nYou can see the help of this module by typing `/modulesinfo` and pressing the fun help button.')
                .setFooter({
                  text:"Asgard ⚖ | Link to fund."})
            ]});
            const config = await jsonRead(filePath);
            config.stateModuleFun = "🟢";
            jsonWrite(filePath, config);
        }
    }
}
}