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
    name: 'serverinfo',
    cooldown: 10000,
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Affiche des infos sur le serveur !"),
    async execute(interaction) {
      const config = await jsonRead(filePath);
      const server = interaction.guild;
      const roles = server.roles.cache;
      const owner = await server.members.fetch(server.ownerId);
      const customEmbedColor = customEmbedColorSchema.findOne({Guild: interaction.guild.id})
      if (owner) {
          return interaction.reply({
              embeds: [
                  new EmbedBuilder()
                    .setColor(`#${customEmbedColor.Color || "000000"}`)
                    .setAuthor({
                        name: 'ASGARD - INFOS DU SERVEUR',
                        iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                        url: 'https://discord.com'
                    })
                    .setDescription(`**📝 Nom du serveur :** ${server.name}
                        **🔎 ID du serveur :** ${server.id}
                        **👑 Créateur du serveur :** ${owner.user.tag}
                        **📅 Date de création :** ${server.createdAt.toUTCString()}
                        **👤 Membres :** ${server.memberCount}
                        **👔 Nombre de rôles :** ${roles.size} rôles`
                    )
                    .setFooter({
                        text: 'Asgard © 2023 | Pour toute information, faites la commande /botinfo'
                    })
              ]
          });
      } else {
          return interaction.reply({
              content: `[❌] Erreur : Impossible de récupérer les infos sur le créateur du serveur`,
              ephemeral: true
          });
      }
  }
};
