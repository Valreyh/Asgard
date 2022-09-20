const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageMentions } = require('discord.js');
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

module.exports = {
    name: 'kick',
    description: 'Kick a player from the server',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a player from the server !')
        .addMentionableOption(name => name
            .setName('name')
            .setRequired(true)
            .setDescription('@ of the player you want to kick')
        ),
    async execute(interaction){
        const config = await jsonRead(filePath);
        if (config.stateModuleModeration === 'OFF'){
            interaction.reply("**[❌]** **ERROR**: Moderation module is disabled !")
        }
        else if (!interaction.member.permissions.has('KICK_MEMBERS') || !interaction.member.permissions.has('ADMINISTRATOR')){
            interaction.reply({
            content: "**[❌]** Error: You don't have the `KICK_MEMBERS` or `ADMNISTRATOR` permission !",
            ephemeral : true
            })
        } else {
            let name = interaction.options.getMentionable('name');
            if(!name){
                interaction.reply("**[❌]** **ERROR**: this member dosen't exist !");
            } else {
                interaction.reply(`**[🚨]** **MODERATION**: ${name} has been **kicked** from the server !`);
                name.kick(); 
            }
        }
    },
}