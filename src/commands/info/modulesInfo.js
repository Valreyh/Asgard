const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonInteraction } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
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
        .setDescription("Montre tous les modules qu'Asgard possède et leurs états"),
    async execute (interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new EmbedBuilder()
                .setColor(`#${config.embedColor}`)
                .setAuthor({
                  name:'ASGARD - MODULES',
                  iconURL:'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png'})
                .setDescription("Ici, vous pouvez voir tous les modules que Asgard possède.\nVous pouvez obtenir la page d'aide des commandes en cliquant sur le bouton\n mais également l'activé en tapant la commande \n`/moduleactivate` ou le désactivé en tapant la commande `/moduledeactivate`")
                .addFields(
                    {name : ':shield:  Modération', value : `Module pour les commandes de modération. \n\n **État actuel** : ${config.stateModuleModeration}\n\u200B`, inline : true},
                    {name : ':confetti_ball:  Fun', value : `Module pour les commandes fun \n\n **État actuel** : ${config.stateModuleFun}\n\u200B`, inline : true},
                    {name : ':white_check_mark:  Réaction de rôle', value : 'Module pour les commandes de réaction de rôle', inline : true},
                    {name : ":toolbox:  Générateur d'embed", value : "Module pour la création d'embed personalisé", inline : true},
                )
                .setFooter({
                  text:"Asgard ⚖ | Pour toute information, faites la commande /botinfo"})],
            components : [new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('moderation_help_modules')
                        .setLabel('Commandes de modération')
                        .setStyle('Secondary')
                        .setEmoji('🛡️'),
                    new ButtonBuilder()
                        .setCustomId('fun_help_modules')
                        .setLabel('Commandes fun')
                        .setStyle('Secondary')
                        .setEmoji('🎊'),
                    new ButtonBuilder()
                        .setCustomId('rolereac_help_modules')
                        .setLabel('Commandes de réaction de rôle')
                        .setStyle('Secondary')
                        .setEmoji('✅'),
                    new ButtonBuilder()
                        .setCustomId('embedcreator_help_modules')
                        .setLabel('Commandes de générateur d\'embed')
                        .setStyle('Secondary')
                        .setEmoji('🧰'),
                    new ButtonBuilder()
                        .setCustomId('page2_help_modules')
                        .setLabel('>> Page 2')
                        .setStyle('Success')
                        .setEmoji('➡️'),
                )
            ],
    });
}}
