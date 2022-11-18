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

// FONCTION POUR ECRIRE DANS LE FICHIER CONFIG
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
    name: 'chatfilter',
    description: 'Filtre le chat en supprimant les messages contenant des mots interdits',
    data: new SlashCommandBuilder()
        .setName('chatfilter')
        .setDescription('Filtre le chat en supprimant les messages contenant des mots interdits')
        .addSubcommand(ajoutermot => ajoutermot
            .setName('ajoutermot')
            .setDescription('Ajoute un mot à la liste des mots interdits')
            .addStringOption(mot => mot
                .setName('mot')
                .setDescription('Mot à ajouter')
                .setRequired(true)
            )
        )
        .addSubcommand(retirermot => retirermot
            .setName('retirermot')
            .setDescription('Retire un mot de la liste des mots interdits')
            .addStringOption(mot => mot
                .setName('mot')
                .setDescription('Mot à retirer')
                .setRequired(true)
            )
        )
        .addSubcommand(ajouterrole => ajouterrole
            .setName('ajouterrole')
            .setDescription('Ajoute un rôle à la liste des rôles exemptés du filtre')
            .addRoleOption(role => role
                .setName('role')
                .setDescription('Rôle à ajouter')
                .setRequired(true)
            )
        )
        .addSubcommand(retirerrole => retirerrole
            .setName('retirerrole')
            .setDescription('Retire un rôle de la liste des rôles exemptés du filtre')
            .addRoleOption(role => role
                .setName('role')
                .setDescription('Rôle à retirer')
                .setRequired(true)
            ),
        )
        .addSubcommand(liste => liste
            .setName('liste')
            .setDescription('Affiche la liste des mots interdits et des rôles exemptés du filtre')
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
        else if (!interaction.member.permissions.has('MANAGE_MESSAGES') || !interaction.member.permissions.has('ADMINISTRATOR')){
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setColor('RED')
                    .setDescription('**[❌]** Vous avez besoin de la permission `GÉRER LES MESSAGES` ou `ADMINISTRATEUR` pour utiliser cette commande !')
                    .setFooter({ 
                        text: "Asgard ⚖ | Link to fund.",
                    })],
                ephemeral: true
            })
        } 
        else 
        {
            const subCommand = interaction.options.getSubcommand();
            if(subCommand === 'liste'){
                interaction.reply({
                    embeds: [ new MessageEmbed()
                        .setColor(`#${config.embedColor}`)
                        .setTitle('Liste des mots interdits et des rôles exemptés du filtre')
                        .setDescription(`**Mots interdits :**\n${config.chatFilter.words.join(', ')}\n\n**Rôles exemptés :**\n${config.chatFilter.exemptedRoles.join(', ')}`)
                        .setFooter({
                            text: "Asgard ⚖ | Link to fund.",
                        })],
            })}
            else if (subCommand === 'ajoutermot'){
                const word = interaction.options.getString('mot');
                if (config.chatFilter.includes(word)){
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**[❌] Le mot \`${word}\` **est déjà dans la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                        ephemeral: true
                    })
                }
                else{
                    config.chatFilter.push(word);
                    await jsonWrite(filePath, config);
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('GREEN')
                            .setDescription(`**[✅] Le mot \`${word}\`** a été ajouté à la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                    })
                }
            }
            else if (subCommand === 'retirermot'){
                const word = interaction.options.getString('mot');
                if (!config.chatFilter.includes(word)){
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**[❌] Le mot \`${word}\`** n'est pas dans la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                        ephemeral: true
                    })
                }
                else{
                    config.chatFilter.splice(config.chatFilter.indexOf(word), 1);
                    jsonWrite(filePath, config);
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('GREEN')
                            .setDescription(`**[✅] Le mot \`${word}\`** a été retiré de la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                    })
                }
            }
            else if (subCommand === 'ajouterrole'){
                const role = interaction.options.getRole('role');
                if (config.chatFilterRoleException.includes(role.id)){
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**[❌] Le rôle \`${role.name}\`** est déjà dans la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                        ephemeral: true
                    })
                }
                else
                {
                    config.chatFilterRoleException.push(role.id);
                    jsonWrite(filePath, config);
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('GREEN')
                            .setDescription(`**[✅] Le rôle \`${role.name}\`** a été ajouté à la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                    })
                }
            }
            else if (subCommand === 'retirerrole'){
                const role = interaction.options.getRole('role');
                if (!config.chatFilterRoleException.includes(role.id)){
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**[❌] Le rôle \`${role.name}\`** n'est pas dans la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                        ephemeral: true
                    })
                }
                else
                {
                    config.chatFilterRoleException.splice(config.chatFilterRoleException.indexOf(role.id), 1);
                    jsonWrite(filePath, config);
                    interaction.reply({
                        embeds: [ new MessageEmbed()
                            .setColor('GREEN')
                            .setDescription(`**[✅] Le rôle \`${role.name}\`** a été retiré de la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Link to fund.",
                            })],
                    })
                }
            }
        }
    },
}