const { SlashCommandBuilder } = require("@discordjs/builders");
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
                embeds: [ new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`**[✅]** **La couleur des embeds** a été changée avec succès !`)
                    .setFooter({
                        text: "Asgard ⚖ | To help me and the bot, use the /vote command"
                    })],
            })
            const config = await jsonRead(filePath);
            config.embedColor = color;
            jsonWrite(filePath, config);
        } else {
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`**[❌]** **La couleur que vous avez chosie** n'est pas au format !`)
                    .setFooter({
                        text: "Asgard ⚖ | To help me and the bot, use the /vote command"
                    })],
                    ephemeral : true
            });
          };
        };
    },
};