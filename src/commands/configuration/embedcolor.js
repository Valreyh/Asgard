const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js')
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');
const customEmbedColorSchema = require('../../schemas/customEmbedColorDB')

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

function isHexColor (hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
}

module.exports = {
    name: 'changeEmbedColor',
    cooldown: 10000,
    description: 'Change la couleur des embeds du bot',
    data: new SlashCommandBuilder()
        .setName('embedcolor')
        .setDescription('Change la couleur des embeds du bot')
        .addStringOption(color => color
            .setName('color')
            .setRequired(true)
            .setDescription('La couleur que vous souhaitez (En hexadécimal sans le #)')
        ),
    async execute(interaction){
      if (!interaction.member.permissions.has('MANAGE_GUILD') || !interaction.member.permissions.has('ADMINISTRATOR')){
        interaction.reply({
          content: "**[❌]** Vous avez besoin de la permission `GÉRER LE SERVEUR` ou `ADMNISTRATEUR` pour utiliser cette commande !",
          ephemeral : true
        })
      } else {
        let color = interaction.options.getString('color');
        if(isHexColor(color)){
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#00FF00')
                    .setDescription(`**[✅]** **La couleur des embeds** a été changée avec succès !`)
                    .setFooter({
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo"
                    })],
            })
            
            await customEmbedColorSchema.create({
              Guild: interaction.guild.id,
              Color: color
          });

        } else {
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`**[❌]** **La couleur que vous avez chosie** n'est pas au format !`)
                    .setFooter({
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo"
                    })],
                    ephemeral : true
            });
          };
        };
    },
};