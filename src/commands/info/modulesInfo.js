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
                .setAuthor('Asgard - Modules','https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png','https://discord.com')
                .setDescription('Here you can see every modules that Asgard has right now.\nYou can see the help by pressing the button and activate it by typing \n/moduleactivate <module name>')
                .addFields(
                    {name : 'Moderation', value : 'Module for moderations commands'},
                    {name : 'Fun', value : 'Module for funs commands'},
                    {name : 'Role Reaction', value : 'Module for reactions roles commands'},
                    {name : 'Embed Creator', value : 'Module for creating embeds'},
                )
                .setFooter("Asgard ⚖ | Link to fund.")],
            components : [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('moderation_help_modules')
                        .setLabel('Moderation Help')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('fun_help_modules')
                        .setLabel('Fun Help')
                        .setStyle('PRIMARY'),     
                )
            ],
    });
}}
