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
                .setAuthor('Asgard - Helps','https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png','https://discord.com')
                .setDescription('Here you can see every commands of the bot')
                .addFields(
                    {name : 'Module', value : 'To see every commands of each modules, type **/modulesinfo**\nTo activate or desactivate a module, type **/moduleactivate** or **/moduledesactivate**'},
                    {name : 'Setup', value : `To setup the bot and all the modules, type **/setupasgard**`},
                    {name : 'Information', value : 'To see the bot information, like if a module is activated or the embed color, type **/botinfo**'},
                    {name : 'Embed Color', value : 'To change the embed color, type **/embedcolor <Hex Color WITHOUT THE #>**'}
                )
                .setFooter('Asgard © 2021 | Link to fund.')],
    })
}}
