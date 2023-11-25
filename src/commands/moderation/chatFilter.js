const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../../config.json');
const chatFilterSchema = require('../../db/chatFilterDB');
const rolesBypassSchema = require('../../db/rolesBypassFilter');

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
        const subCommand = interaction.options.getSubcommand();

        const wordsList = await chatFilterSchema.find();
        const roleBypassList = await rolesBypassSchema.find();

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
        else if (!interaction.member.permissions.has('MANAGE_MESSAGES') || !interaction.member.permissions.has('ADMINISTRATOR') && subCommand != "liste"){
            interaction.reply({
                embeds: [ new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('**[❌]** Vous avez besoin de la permission `GÉRER LES MESSAGES` ou `ADMINISTRATEUR` pour utiliser cette commande !')
                    .setFooter({ 
                        text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                    })],
                ephemeral: true
            })
        } 
        else 
        {
            const subCommand = interaction.options.getSubcommand();
            if(subCommand === 'liste'){

                var wordValues = [];
                await wordsList.forEach(async w => {
                    wordValues.push(w.word);
                })

                var roleBypassValues = [];
                await roleBypassList.forEach(async r => {
                    roleBypassValues.push(r.roleID)
                })

                interaction.reply({
                    embeds: [ new EmbedBuilder()
                        .setColor(`#${config.embedColor}`)
                        .setTitle('Liste des mots interdits et des rôles exemptés du filtre')
                        .setDescription(`**Mots interdits :**\n${wordValues.join('\n')}\n\n**Rôles exemptés :**\n${roleBypassValues.map(role => role.name).join('\n')}`)
                        .setFooter({
                            text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                        })],
            })}
            else if (subCommand === 'ajoutermot'){
                const wordToAdd = interaction.options.getString('mot');
                if (await chatFilterSchema.findOne({word: wordToAdd})){
                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('#FF0000')
                            .setDescription(`**[❌] Le mot \`${wordToAdd}\` **est déjà dans la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                        ephemeral: true
                    })
                }
                else{
                    await chatFilterSchema.create({
                        word: wordToAdd
                    })

                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('#00FF00')
                            .setDescription(`**[✅] Le mot \`${wordToAdd}\`** a été ajouté à la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                    })
                }
            }
            else if (subCommand === 'retirermot'){
                const wordToDelete = interaction.options.getString('mot');
                if (!chatFilterSchema.findOne({word: wordToDelete})){
                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('#FF0000')
                            .setDescription(`**[❌] Le mot \`${wordToDelete}\`** n'est pas dans la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                        ephemeral: true
                    })
                }
                else{
                    await wordsList.forEach(async w => {
                        await chatFilterSchema.deleteOne({word: wordToDelete});
                    })

                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('00FF00')
                            .setDescription(`**[✅] Le mot \`${word}\`** a été retiré de la liste des mots interdits.`)
                            .setFooter({ 
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                    })
                }
            }
            else if (subCommand === 'ajouterrole'){
                const roleToAdd = interaction.options.getString('role');
                if (await chatFilterSchema.findOne({roleID: roleToAdd})){
                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('#FF0000')
                            .setDescription(`**[❌] Le rôle \`${roleToAdd.name}\`** est déjà dans la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                        ephemeral: true
                    })
                }
                else
                {
                    await chatFilterSchema.create({
                        roleID: role.id
                    })
                    jsonWrite(filePath, config);
                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('00FF00')
                            .setDescription(`**[✅] Le rôle \`${roleToAdd.name}\`** a été ajouté à la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                    })
                }
            }
            else if (subCommand === 'retirerrole'){
                const roleToDelete = interaction.options.getString('role');
                if (await roleBypassList.findOne({roleID: roleToDelete})){
                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('#FF0000')
                            .setDescription(`**[❌] Le rôle \`${roleToDelete.name}\`** n'est pas dans la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                        ephemeral: true
                    })
                }
                else
                {
                    await roleBypassList.forEach(async r => {
                        await rolesBypassSchema.deleteOne({roleID: roleToDelete});
                    })

                    interaction.reply({
                        embeds: [ new EmbedBuilder()
                            .setColor('#00FF00')
                            .setDescription(`**[✅] Le rôle \`${role.name}\`** a été retiré de la liste des rôles exemptés du filtre.`)
                            .setFooter({
                                text: "Asgard ⚖ | Pour toute information, faites /botinfo",
                            })],
                    })
                }
            }
        }
    },
}