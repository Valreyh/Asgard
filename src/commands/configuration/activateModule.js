const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');

// FONCTION POUR LIRE LE FICHIER CONFIG
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
  
// FONCTION POUR ECRIRE DANS LE FICHIER CONFIG
 function jsonWrite(filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
}

module.exports = {
    name: 'activatemodule',
    cooldown: 20000,
    description: 'Active un module ddu bot',
    data: new SlashCommandBuilder()
        .setName('moduleactivate')
        .setDescription('Active un module du bot')
        .addStringOption(modulename => modulename
            .setName('modulename')
            .setRequired(true)
            .setDescription('Le nom du module')
            .addChoice('Moderation', 'ModerationModule')
            .addChoice('Fun', 'FunModule')
        ),
    async execute(interaction){
        if (!interaction.member.permissions.has('MANAGE_GUILD') || !interaction.member.permissions.has('ADMINISTRATOR')){
          interaction.reply({
            embeds: [ new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('**[❌]** **Vous avez besoin** de la permission `GÉRER LE SERVEUR` or `ADMINISTRATEUR` pour utiliser cette commande !')
              .setFooter({
                text: "Asgard ⚖ | Pour toute information, faites /botinfo"
          })],
            ephemeral : true
          })
        } else {
        let name = interaction.options.getString('modulename');
        if(name === 'ModerationModule'){
            interaction.reply({
              embeds: [new EmbedBuilder()
                .setColor("#00FF00")
                .setDescription(":shield: **Le module de `modération` est maintenant ACTIVÉ 🟢**\n\nPour avoir la liste des commandes, faites la commande `/modulesinfo` et appuyer sur le bouton d'aide du module modération.")
                .setFooter({
                  text:"Asgard ⚖ | Pour toute information, faites /botinfo"})
                ]});
            const config = await jsonRead(filePath);
            config.stateModuleModeration = '🟢';
            jsonWrite(filePath, config);
        } else if ( name === 'FunModule'){
            interaction.reply({
              embeds: [new EmbedBuilder()
                .setColor("#00FF00")
                .setDescription(":video_game: **Le module du `fun` est maintenant ACTIVÉ 🟢**\n\nPour avoir la liste des commandes, faites la commande `/modulesinfo` et appuyer sur le bouton d'aide du module fun.")
                .setFooter({
                  text:"Asgard ⚖ | Pour toute information, faites /botinfo"})
            ]});
            const config = await jsonRead(filePath);
            config.stateModuleFun = "🟢";
            jsonWrite(filePath, config);
        }
    }
}
}