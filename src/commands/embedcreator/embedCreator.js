const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
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
        const customEmbedColor = await customEmbedColorSchema.findOne({Guild: interaction.guild.id})
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(`#${customEmbedColor ? customEmbedColor.Color : "000000"}`)
            .setFooter({
                text: `Asgard ⚖ | Pour toute information, faites /botinfo`
            });
        channel.send({ embeds: [embed] });
        interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(`#00FF00`)
                .setDescription(`**[✅]** **Embed envoyé avec succès dans le salon <#${channelId}> !**`)
                .setFooter({
                    text: `Asgard ⚖ | Pour toute information, faites /botinfo`
                })],
            ephemeral: true
        });
    }
}