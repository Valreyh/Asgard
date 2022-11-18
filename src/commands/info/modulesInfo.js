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
        .setDescription("Montre tous les modules qu'Asgard possède et leurs états"),
    async execute (interation) {
        const config = await jsonRead(filePath);
        interation.reply({
            embeds : [new MessageEmbed()
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
                  text:"Asgard ⚖ | To help me and the bot, use the /vote command"})],
            components : [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('moderation_help_modules')
                        .setLabel('Commandes de modération')
                        .setStyle('SECONDARY')
                        .setEmoji('🛡️'),
                    new MessageButton()
                        .setCustomId('fun_help_modules')
                        .setLabel('Commandes fun')
                        .setStyle('SECONDARY')
                        .setEmoji('🎊'),
                    new MessageButton()
                        .setCustomId('rolereac_help_modules')
                        .setLabel('Commandes de réaction de rôle')
                        .setStyle('SECONDARY')
                        .setEmoji('✅'),
                    new MessageButton()
                        .setCustomId('embedcreator_help_modules')
                        .setLabel('Commandes de générateur d\'embed')
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
