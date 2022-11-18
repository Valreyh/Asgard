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
        .setDescription("Affiche la liste des commandes !"),
    async execute(interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new MessageEmbed()
                .setColor(`#${config.embedColor}`)
                .setAuthor({
                  name:'ASGARD - AIDE',
                  iconURL:'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                  url:'https://discord.com'
                })
                .setDescription('Here you can see every commands of the bot')
                .addFields(
                    {name : ':gear: Modules', value : 'Pour voir chaque commande de chaque module, faites la commande `/modulesinfo` et appuyer sur le bouton correspondant au module que vous souhaitez voir.\nPour activer ou désactiver un module, faites la commande `/moduleactivate` ou `/moduledesactivate`'},
                    {name : ':computer: Setup', value : `Pour configurer le bot et tout ses modules, faites la commande \`/setupasgard\`\nCette commande est recommandé pour les nouveaux serveurs.`},
                    {name : ':question: Informations', value : 'Pour afficher les informations du bot, comme la couleur des embeds ou le nom du créateur, faites la commande `/botinfo`'},
                    {name : ':art: Embed Color', value : 'Pour changer la couleur des embeds, faites la commande `/embedcolor` et suivez les instructions !'},
                )
                .setFooter({
                  text:'Asgard © 2021 | To help me and the bot, use the /vote command'
                  })],
    })
}}
