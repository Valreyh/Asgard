const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
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
    name: 'desactivatemodule',
    cooldown: 10000,
    description: 'Desactivate a bot module',
    data: new SlashCommandBuilder()
        .setName('moduledesactivate')
        .setDescription('Desactivate a module name')
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
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription(':shield: **Moderation module is now DESACTIVATED 🔴**')
                    .setFooter({
                        text: "Asgard ⚖ | Link to fund."
                    })
                  ]});
            const config = await jsonRead(filePath);
            config.stateModuleModeration = '🔴';
            jsonWrite(filePath, config);
        } else if ( name === 'FunModule'){
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription(':confetti_ball: **Fun module is now DESACTIVATED 🔴**')
                    .setFooter({
                        text: "Asgard ⚖ | Link to fund."
                    })
            ]});
            const config = await jsonRead(filePath);
            config.stateModuleFun = "🔴";
            jsonWrite(filePath, config);
        }
        }
    },
}