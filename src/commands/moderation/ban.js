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

module.exports = {
    name: 'ban',
    description: 'Ban une personne du serveur',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban une personne du serveur !')
        .addMentionableOption(name => name
            .setName('name')
            .setRequired(true)
            .setDescription('@ de la personne que vous voulez ban')
        )
        .addStringOption(reason => reason
            .setName('reason')
            .setRequired(false)
            .setDescription('Raison du ban')
        ),
    async execute(interaction){
        const config = await jsonRead(filePath);
        if (config.stateModuleModeration === '🔴'){
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription("**[❌] Le module de modération est désactivé.**\nPour l'activer, utiliser la commande `/moduleactivate` !")
                    .setFooter({
                        text: "Asgard ⚖ | Link to fund.",
                    })],
                ephemeral: true
            })
        }
        else if (!interaction.member.permissions.has('BAN_MEMBERS') || !interaction.member.permissions.has('ADMINISTRATOR')){
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription('**[❌]** Vous avez besoin de la permission `BANNIR DES MEMBRES` ou `ADMINISTRATEUR` pour utiliser cette commande !')
                    .setFooter({ 
                        text: "Asgard ⚖ | Link to fund.",
                    })],
                ephemeral: true
            })
        } 
        else if (interaction.member.roles.highest.rawPosition < interaction.options.getMentionable('name').roles.highest.rawPosition)
        {
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription("**[❌]** **Vous avez besoin d'une rôle plus haut dans la hiéarchie** que la personne que vous voulez ban !")
                    .setFooter({ 
                        text: "Asgard ⚖ | Link to fund.",
                    })],
                ephemeral: true
            })
        }
        else if (interaction.guild.me.roles.highest.rawPosition < interaction.options.getMentionable('name').roles.highest.rawPosition)
        {
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription("**[❌]** **Asgard à besoin d'un rôle plus haut dans la hiéarchie** que la personne que vous voulez ban !")
                    .setFooter({ 
                        text: "Asgard ⚖ | Link to fund.",
                    })],
                ephemeral: true
            })
        }
        else {
            let name = interaction.options.getMentionable('name');
            if(!name){
                interaction.reply({
                    embeds: [ new MessageEmbed()
                        .setColor('RED')
                        .setDescription("**[❌]** **Cet utilisateur** n'existe pas !")
                        .setFooter({
                            text: "Asgard ⚖ | Link to fund.",
                        })],
                });
            } else {
                if({$reason} === null){
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor(`#${config.embedColor}`)
                            .setAuthor({
                                name: `ASGARD - MODERATION`,
                                iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                            })
                            .setDescription(`**[:shield:]** ${name} a été ban du serveur !`)
                            .setFooter({
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                    });
                } else {
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor(`#${config.embedColor}`)
                            .setAuthor({
                                name: `ASGARD - MODERATION`,
                                iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                            })
                            .setDescription(`**[:shield:]** ${name} a été ban du serveur pour la raison suivante : ${$reason}`)
                            .setFooter({
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                    });
                }
                name.ban(); 
            }
        }
    },
}