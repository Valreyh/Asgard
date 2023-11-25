const { EmbedBuilder, MessageContent} = require('discord.js');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../config.json');

const chatFilterSchema = require('../db/chatFilterDB');
const rolesBypassSchema = require('../db/rolesBypassFilter');

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

const cooldowns = new Map();

module.exports = async (message, client) => {
    if (message.author.bot) return;

    const userCooldown = cooldowns.get(message.author.id);

    const wordsListDB = await chatFilterSchema.find();
    const roleBypassListDB = await rolesBypassSchema.find();

    var wordsList = [];
    await wordsListDB.forEach(async w => {
        wordsList.push(w.word);
    })

    var roleBypassList = [];
    await roleBypassListDB.forEach(async r => {
        roleBypassList.push(r.roleID)
    })

    if (userCooldown && (Date.now() - userCooldown) < 10000) {
        for (let i = 0; i < wordsList.length; i++) {
            if(message.content.toLowerCase().includes(wordsList[i].toLowerCase()))
            {
                message.delete();
                return;
            }
        }
    }

    if (message.member.roles.cache.some(role => roleBypassList.includes(role.id))) return;

    for (let i = 0; i < wordsList.length; i++) {
        if (message.content.toLowerCase().includes(wordsList[i].toLowerCase())) {
            const user = message.author;
            const guild = message.guild;

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`**[❌] ${user.toString()} Ton message a été supprimé** car il contenait un mot interdit.\nPour connaître la liste des mots interdits, tapez \`/chatfilter liste\` dans le serveur correspondant !`)
                .setFooter({
                    text: `Asgard ⚖ | Pour toute information, faites la commande /botinfo`,
                });

            if (guild) {
                const guildIconURL = guild.iconURL();
                if (guildIconURL) {
                    embed.setAuthor({
                        name: `Infraction sur : ${guild.name}`,
                        iconURL: guildIconURL,
                    });
                } else {
                    embed.setAuthor(`Infraction sur : ${guild.name}`);
                }
            }

            try {
                await user.send({
                    embeds: [embed],
                    ephemeral: true,
                });
            } catch (error) {
                console.error(`Impossible d'envoyer un MP à ${user.tag}:`, error);
            }

            message.delete();

            cooldowns.set(message.author.id, Date.now());
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 10000); // 10 secondes de cooldown
            break;
        }
    }
}
