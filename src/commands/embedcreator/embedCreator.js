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

module.exports = 
{
    name: 'embedcreator',
    description: 'Create an embed and send it to the channel we chose',
    cooldown:20000,
    data: new SlashCommandBuilder()
        .setName('embedcreator')
        .setDescription('Create an embed and send it to the channel we chose and use a modal to create it')
        .addStringOption(option => option
            .setName('channelid')
            .setDescription('The channel where the embed will be sent')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('title')
            .setDescription('Title of the embed')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('description')
            .setDescription('Description of the embed')
            .setRequired(true)
        ),
    async execute(interaction) {
        const config = await jsonRead(filePath);
        const channelId = interaction.options.getString('channelid');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const channel = interaction.client.channels.cache.get(channelId);
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(`${config.embedColor}`)
            .setFooter({
                text: `Asgard ⚖ | To help me and the bot, use the /vote command`
            });
        channel.send({ embeds: [embed] });
        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(`${config.embedColor}`)
                .setDescription(`**[✅]** **Embed envoyé avec succès dans le salon <#${channelId}> !**`)
                .setFooter({
                    text: `Asgard ⚖ | To help me and the bot, use the /vote command.`
                })],
            ephemeral: true
        });
    }
}