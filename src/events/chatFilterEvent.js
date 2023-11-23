const { EmbedBuilder, MessageContent} = require('discord.js');
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

const cooldowns = new Map();

module.exports = async (message, client) => {
    if (message.author.bot) return;

    const config = await jsonRead(filePath);
    const badWords = config.chatFilter;
    const rolesExcepted = config.chatFilterRoleException;
    const userCooldown = cooldowns.get(message.author.id);

    if (userCooldown && (Date.now() - userCooldown) < 60000) {
        message.delete();
        return;
    }

    if (message.member.roles.cache.some(role => rolesExcepted.includes(role.id))) return;

    for (let i = 0; i < badWords.length; i++) {
        if (message.content.toLowerCase().includes(badWords[i].toLowerCase())) {
            const user = message.author;
            const guild = message.guild;

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`**[❌] ${user.toString()} Ton message a été supprimé** car il contenait un mot interdit.\nPour connaître la liste des mots interdits, tapez \`/chatfilter liste\``)
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
            }, 60000); // 60 secondes de cooldown
            break;
        }
    }
}
