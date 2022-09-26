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

module.exports = {
    name: 'help',
    data : new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show every commands of the bot"),
    async execute(interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new MessageEmbed()
                .setColor(`#${config.embedColor}`)
                .setAuthor({
                  name:'ASGARD - HELP',
                  iconURL:'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                  url:'https://discord.com'
                })
                .setDescription('Here you can see every commands of the bot')
                .addFields(
                    {name : ':gear: Modules', value : 'To see every commands of each modules, type `/modulesinfo` and press the button of the module you want to see\nTo activate or desactivate a module, type `/moduleactivate` or `/moduledesactivate`'},
                    {name : ':computer: Setup', value : `To setup the bot and all the modules, type \`/setupasgard\`\nThis is recommended for the first use of the bot`},
                    {name : ':question: Informations', value : 'To see the bot information, like the embed color or the creator name, type `/botinfo`'},
                    {name : ':art: Embed Color', value : 'To change the embed color, type `/embedcolor` and follow the instructions'},
                )
                .setFooter({
                  text:'Asgard © 2021 | Link to fund.'
                  })],
    })
}}
