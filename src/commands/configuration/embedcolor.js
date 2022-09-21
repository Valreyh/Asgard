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
    description: 'Change the embed color of the bot',
    data: new SlashCommandBuilder()
        .setName('embedcolor')
        .setDescription('Change the embed color of the bot')
        .addStringOption(color => color
            .setName('color')
            .setRequired(true)
            .setDescription('Color you want to have (HEX FORMAT WITHOUT THE #)')
        ),
    async execute(interaction){
      if (!interaction.member.permissions.has('MANAGE_GUILD') || !interaction.member.permissions.has('ADMINISTRATOR')){
        interaction.reply({
          content: "**[❌]** **ERROR**: You don't have the `MANAGE_SERVER` or `ADMNISTRATOR` permission !",
          ephemeral : true
        })
      } else {
        let color = interaction.options.getString('color');
        if(isHexColor(color)){
            interaction.reply('**[🚨]** Config: Embed color changed !');
            const config = await jsonRead(filePath);
            config.embedColor = color;
            jsonWrite(filePath, config);
        } else {
            interaction.reply({
                content: '**[❌]** Error: The color you chose is not at the Hex format ! (#XXXXXX WITHOUT THE #)',
                ephemeral: true
            });
        };
        };
    },
};