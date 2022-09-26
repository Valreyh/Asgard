const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, ButtonInteraction } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
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
    name: "modules",
    data : new SlashCommandBuilder()
        .setName("modulesinfo")
        .setDescription("Shows all modules that Asgard has"),
    async execute (interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new MessageEmbed()
                .setColor(`#${config.embedColor}`)
                .setAuthor({
                  name:'ASGARD - MODULES',
                  iconURL:'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png'})
                .setDescription('Here you can see every modules that Asgard has right now.\nYou can see the help by pressing the button and activate it by typing \n`/moduleactivate` or desactivate it by typing `/moduledesactivate`')
                .addFields(
                    {name : ':shield:  Moderation', value : `Module for moderations commands. \n\n **Current State ** : ${config.stateModuleModeration}\n\u200B`, inline : true},
                    {name : ':confetti_ball:  Fun', value : `Module for funs commands \n\n **Current State** : ${config.stateModuleFun}\n\u200B`, inline : true},
                    {name : ':white_check_mark:  Role Reaction', value : 'Module for reactions roles commands', inline : true},
                    {name : ':toolbox:  Embed Creator', value : 'Module for creating embeds', inline : true},
                )
                .setFooter({
                  text:"Asgard ⚖ | Link to fund."})],
            components : [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('moderation_help_modules')
                        .setLabel('Moderation Help')
                        .setStyle('SECONDARY')
                        .setEmoji('🛡️'),
                    new MessageButton()
                        .setCustomId('fun_help_modules')
                        .setLabel('Fun Help')
                        .setStyle('SECONDARY')
                        .setEmoji('🎊'),
                    new MessageButton()
                        .setCustomId('rolereac_help_modules')
                        .setLabel('Role Reaction Help')
                        .setStyle('SECONDARY')
                        .setEmoji('✅'),
                    new MessageButton()
                        .setCustomId('embedcreator_help_modules')
                        .setLabel('Embed Creator Help')
                        .setStyle('SECONDARY')
                        .setEmoji('🧰'),
                    new MessageButton()
                        .setCustomId('page2_help_modules')
                        .setLabel('>> Page 2')
                        .setStyle('SUCCESS')
                        .setEmoji('➡️'),
                )
            ],
    });
}}
