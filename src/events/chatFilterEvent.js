const { MessageEmbed, MessageContent} = require('discord.js');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../config.json');

// FONCTION POUR LIRE LE FICHIER CONFIG
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

module.exports = async (message, client) =>
{
    if (message.author.bot) return;

    const config = await jsonRead(filePath);

    const badWords = config.chatFilter;
    const rolesExcepted = config.chatFilterRoleException;
    
    // Si l'auteur du message a un rôle qui est dans la liste des rôles exceptés, le bot ne supprime pas le message
    if (message.member.roles.cache.some(role => rolesExcepted.includes(role.id))) return;

    for (let i = 0; i < badWords.length; i++)
    {
        // Si le messagr que l'utilisateur à envoyé contient un mot dans la liste
        if (message.content.toLowerCase().includes(badWords[i].toLowerCase()))
        {
          message.delete();
          message.channel.send({
            embeds: [ new MessageEmbed()
              .setColor('RED')
              // On ping l'utilisateur qui a envoyé le message
              .setDescription(`**[❌] ${message.author}, ton message a été supprimé** car il contenait un mot interdit.\nPour connaitre la liste des mots interdits, tapez \`/chatfilter liste\``)
              .setFooter({
                  text: "Asgard ⚖ | To help me and the bot, use the /vote command",
              })
            ]});
          break;
        }
      }
}
