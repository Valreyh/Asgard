const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
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
        .setDescription("Affiche les informations du bot"),
    async execute(interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new EmbedBuilder()
                .setColor(`#${config.embedColor}`)
                .setAuthor({
                  name:'ASGARD - INFORMATIONS DU BOT',
                  iconURL:'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                  url:'https://discord.com'
                })
                .setDescription('_Asgard, le bot français simple et multifonction_')
                .addFields(
                    {name : ':scales: Information', value : '__Créateur__ : valreyh\n__Version__ : 1.0.0', inline : true},
                    {name : ":art: Couleur de l'embed", value: `Couleur actuelle de l'embed : **#${config.embedColor}**`, inline : true},
                    {name : ':mag_right: Help', value : "Pour savoir toutes les commandes du bot, faites la commande `/help`"},
                    {name : ':moneybag: Donation', value : 'Si vous voulez me soutenir, vous pouvez faire un don ici : **link**\nCela permet de maintenir le bot en vie', inline : true},
                )
                .setFooter({
                  text:'Asgard © 2023'
                })],
    })
}}
