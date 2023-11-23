const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
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
    description: 'Kick une personne du serveur',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick une personne du serveur !')
        .addMentionableOption(name => name
            .setName('name')
            .setRequired(true)
            .setDescription('@ de la personne que vous voulez kick')
        ),
    async execute(interaction){
        const config = await jsonRead(filePath);
        if (config.stateModuleModeration === '🔴'){
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("**[❌] Le module de modération est désactivé.**\nPour l'activer, utiliser la commande `/moduleactivate` !")
                    .setFooter({
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                    })],
                ephemeral: true
            })
        }
        else if (!interaction.member.permissions.has('KICK_MEMBERS') || !interaction.member.permissions.has('ADMINISTRATOR')){
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('**[❌]** Vous avez besoin de la permission `KICK DES MEMBRES` ou `ADMINISTRATEUR` pour utiliser cette commande !')
                    .setFooter({ 
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                    })],
                ephemeral: true
            })
        } 
        else if (interaction.member.roles.highest.rawPosition < interaction.options.getMentionable('name').roles.highest.rawPosition)
        {
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("**[❌]** **Vous avez besoin d'une rôle plus haut dans la hiéarchie** que la personne que vous voulez kick !")
                    .setFooter({ 
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                    })],
                ephemeral: true
            })
        }
        else if (interaction.guild.me.roles.highest.rawPosition < interaction.options.getMentionable('name').roles.highest.rawPosition)
        {
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription("**[❌]** **Asgard à besoin d'un rôle plus haut dans la hiéarchie** que la personne que vous voulez kick !")
                    .setFooter({ 
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                    })],
                ephemeral: true
            })
        }
        else {
            let name = interaction.options.getMentionable('name');
            if(!name){
                interaction.reply({
                    embeds: [ new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription("**[❌]** **Cet utilisateur** n'existe pas !")
                        .setFooter({
                            text: "Asgard ⚖ | Pour toute information, faites /botinfo.",
                        })],
                });
            } else {
                interaction.reply({
                    embeds: [ new EmbedBuilder()
                        .setColor(`#${config.embedColor}`)
                        .setAuthor({
                            name: `ASGARD - MODERATION`,
                            iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                        })
                        .setDescription(`**[:shield:]** ${name} a été kick du serveur !`)
                        .setFooter({
                            text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                        })],
                });
                name.kick(); 
            }
        }
    },
}