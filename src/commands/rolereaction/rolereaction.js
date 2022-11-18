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
    name: 'rolereaction',
    description: 'Create a role reaction message using a message id and a role mention and a reaction to add',
    cooldown:20000,
    data: new SlashCommandBuilder()
        .setName('rolereaction')
        .setDescription('Create a role reaction message using a message id and a role mention and a reaction to add')
        .addStringOption(option => option
            .setName('messageid')
            .setDescription('The message id where the reaction will be added')
            .setRequired(true)
        )
        .addMentionableOption(option => option
            .setName('role')
            .setDescription('The role mention')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reaction')
            .setDescription('The reaction to add')
            .setRequired(true)
        ),
    async execute(interaction) {
        
}