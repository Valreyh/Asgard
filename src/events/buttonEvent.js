const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Collection} = require('discord.js');
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

//Cooldown
const cooldown = new Set();
const cooldownListMember = new Set();

module.exports = async (interaction, client) =>
{
    if (!interaction.isButton()) return;
	const config = await jsonRead(filePath);
	if(interaction.isButton())
	{
		// ON CHECK SI LA PERSONNE EST EN COOLDOWN, SI ELLE L'EST PAS, ON L'AJOUTE DANS LA LISTE DES COOLDOWN //
		if(cooldown.has(interaction.member.id) && !cooldownListMember.has(interaction.member.id)) 
		{
			cooldownListMember.add(interaction.member.id);
			setTimeout(() => {
				cooldownListMember.delete(interaction.member.id)
			}, 10000);
			interaction.reply({ 
				embeds: [
					new EmbedBuilder()
					.setColor(`#FF0000`)
					.setAuthor({
						name: `ASGARD - COOLDOWN`,
						iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
					.setDescription(`**[⌛]** Vous êtes en **COOLDOWN**, merci d'attendre **10 seconds** avant de rappuyer sur un bouton.`)
					.setFooter({
						text: "Asgard ⚖ | Pour toute information, faites /botinfo"
					})
				],
				ephemeral: true
			});
		} 
		// SI COOLDOWN, ON NE FAIT RIEN //
		else if(cooldown.has(interaction.member.id) && cooldownListMember.has(interaction.member.id)) { return;} 
		// ON CHECK QUEL BOTON A ETE CLIQUE ET ON AJOUTE LE JOUEUR DANS LA LISTE DU COOLDOWN //
		else {
			cooldown.add(interaction.member.id);
			setTimeout(() => {
				cooldown.delete(interaction.member.id)
			}, 10000);
			if(interaction.customId === "page2_help_modules") 
			{
				interaction.reply({
					embeds: [
						new EmbedBuilder()
						.setColor(`#${config.embedColor}`)
						.setAuthor({
							name: `ASGARD - MODULES`,
							iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
						.setDescription("Ici, vous pouvez voir tous les modules que Asgard possède.\nVous pouvez obtenir la page d'aide des commandes en cliquant sur le bouton\n mais également l'activé en tapant la commande \n`/moduleactivate` ou le désactivé en tapant la commande `/moduledeactivate`")
                		.addFields(
                    		{name : ':crossed_swords: Commandes Personnalisées', value : 'Module pour les commandes personnalisées', inline : true},
                    		{name : ':bell: Notifications', value: 'Module pour les notifications twitch/youtube', inline: true},
                    		{name : ':page_facing_up: Logs', value: 'Module pour le système de logs', inline: true},
						)
						.setFooter({
							text: "Asgard ⚖ | Link to fund."})],
					components: [
						new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
							.setCustomId('custom_commands_help_modules')
							.setLabel('Commandes Personnalisées')
							.setStyle('Secondary')
							.setEmoji('⚔'),
							new ButtonBuilder()
							.setCustomId('notifications_help_modules')
							.setLabel('Notifications')
							.setStyle('Secondary')
							.setEmoji('🔔'),
							new ButtonBuilder()
							.setCustomId('logs_help_modules')
							.setLabel('Logs')
							.setStyle('Secondary')
							.setEmoji('📄'),
						),
					],
				});
			}
			else if(interaction.customId === 'moderation_help_modules') 
			{
				interaction.reply({
					embeds: [
						new EmbedBuilder()
						.setColor(`#${config.embedColor}`)
						.setAuthor({
							name:"ASGARD - MODULES",
							iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
						.addFields(
							{name: 'Moderation', value: '/ban user | Ban the user from the server\n/kick user | Kick the user from the server'}
						)
						.setFooter({
							text:"Asgard ⚖ | Pour toute information, faites /botinfo"})
					]
				})
			} 
			else if(interaction.customId === 'fun_help_modules') 
			{
				interaction.reply({
					embeds: [
						new EmbedBuilder()
						.setColor(`#${config.embedColor}`)	
						.setAuthor({
							name:"ASGARD - MODULES",
							iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
						.addFields(
							{name:'Fun', value: '/ping | Check if the bot respond'})
						.setFooter({
							text:"Asgard ⚖ | Pour toute information, faites /botinfo"})
					]
				})
			}
        }
    }
}
