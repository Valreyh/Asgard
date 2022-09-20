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
                .setAuthor('Asgard - Bot information','https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png','https://discord.com')
                .setDescription('Asgard, the discord bot designed for begginer')
                .addFields(
                    {name : 'Information', value : '__Creator__ : "Vaalreeyh#2626\n__Version__ : 1.1.0\nThis bot is entirely free, but you can help me with a donation'},
                    {name : 'Module state', value : `__By default, every modules are activated !__\n\nModeration module state : **[${config.stateModuleModeration}]**\nFun module state : **[${config.stateModuleFun}]**`},
                    {name : 'Embed color', value: `Actual embed color : **#${config.embedColor}**\nTo change the embed color, type **/embedcolor**`},
                    {name : 'Donation', value : 'If you want to help me, you can donate here : **link**'}
                )
                .setFooter('Asgard © 2021 | Link to fund.')],
    })
}}
