const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');
const customEmbedColorSchema = require('../../schemas/customEmbedColorDB');

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
    name: 'userinfo',
    description: `Obtient les informations d'un utilisateur`,
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription(`Obtient les informations discord d'un utilisateur !`)
        .addMentionableOption(name => name
            .setName('utilisateur')
            .setRequired(false)
            .setDescription('@ de la personne')
        ),
    async execute(interaction){
        const config = await jsonRead(filePath);
        if (config.stateModuleUtility === '🔴'){
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("**[❌] Le module d'utility est désactivé.**\nPour l'activer, utiliser la commande `/moduleactivate` !")
                    .setFooter({
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                    })],
                ephemeral: true
            })
        }
        else {
            let nameOption = interaction.options.getUser('utilisateur');

            if (!nameOption) {
                nameOption = interaction.user;
            }

            const customEmbedColor = await customEmbedColorSchema.findOne({Guild: interaction.guild.id})

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${customEmbedColor ? customEmbedColor.Color : "000000"}`)
                        .setAuthor({
                            name: `ASGARD - INFOS D'UN UTILISATEUR`,
                            iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                            url: 'https://discord.com'
                        })
                        .setThumbnail(nameOption.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
                        .setDescription(`**📝 Utilisateur :** ${nameOption.username}                                      
                                  **🔎 ID Utilisateur :** ${nameOption.id}
                                  **📅 Date de création du compte :** ${nameOption.createdAt.toUTCString()}`
                        )
                        .setFooter({
                            text: 'Asgard © 2023 | Pour toute information, faites la commande /botinfo'
                        })
                ]
            });
        }
    },
};
