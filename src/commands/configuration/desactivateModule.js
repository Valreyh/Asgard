const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
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
    name: 'desactivatemodule',
    cooldown: 10000,
    description: 'Desactive a bot module',
    data: new SlashCommandBuilder()
        .setName('moduledesactivate')
        .setDescription('Désactive un module du bot')
        .addStringOption(modulename => modulename
            .setName('modulename')
            .setRequired(true)
            .setDescription('Désactive un module du bot')
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
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(':shield: **Le module de `modération` a été DÉSACTIVÉ 🔴**')
                    .setFooter({
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo"
                    })
                  ]});
            const config = await jsonRead(filePath);
            config.stateModuleModeration = '🔴';
            jsonWrite(filePath, config);
        } else if ( name === 'FunModule'){
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(':confetti_ball: **Le module du `fun` a été DÉSACTIVÉ 🔴**')
                    .setFooter({
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo"
                    })
            ]});
            const config = await jsonRead(filePath);
            config.stateModuleFun = "🔴";
            jsonWrite(filePath, config);
        }
        }
    },
}