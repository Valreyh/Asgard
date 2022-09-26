const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const path = require('path');
const fs = require('fs');
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
    name: 'bot_info',
    data : new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Show the bot informations"),
    async execute(interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new MessageEmbed()
                .setColor(`#${config.embedColor}`)
                .setAuthor({
                  name:'ASGARD - BOT INFORMATION',
                  iconURL:'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                  url:'https://discord.com'
                })
                .setDescription('_Asgard, the simplist discord bot designed for beginners_')
                .addFields(
                    {name : ':scales: Information', value : '__Creator__ : "Valreyh#3759\n__Version__ : 1.0.0', inline : true},
                    {name : ':art: Embed color', value: `Actual embed color : **#${config.embedColor}**`, inline : true},
                    {name : ':mag_right: Help', value : 'To see every commands of the bot, type `/help`'},
                    {name : ':moneybag: Donation', value : 'If you want to help me, you can donate here : **link**', inline : true},
                )
                .setFooter({
                  text:'Asgard © 2021 | Link to fund.'
                })],
    })
}}
