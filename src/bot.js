// Asgard 2021 | Start : 15/12/2021 //
// Fonctions : De la modération légère, un module de fun, Info bot, un créateur d'embed, système de niveau, des help commandes //
// Asgard : thes simplist bot for your discord server //
// Auteur : Valreyh

//////////////////
//				//
// REQUIRED LIB //
//				//
//////////////////

require("dotenv").config()
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9") 
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Embed } = require("@discordjs/builders");

///////////////////////////////
//				             //
// LECTURE DU FICHIER CONFIG //
//				             //
///////////////////////////////

const path = require('path');
const filePath = path.resolve(__dirname, './config.json');

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

/////////////////////////////////
//					           //
// ON DEFINIE LE CLIENT DU BOT //
//				               //
/////////////////////////////////

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	] 
});

var token = process.env.TOKEN;

//////////////////////////////
//				            //
// GENERATION DES COMMANDES //
//				            //
//////////////////////////////

client.commands = new Collection();
const configurationFiles = fs.readdirSync('src/commands/configuration').filter(file => file.endsWith('.js'));
const commands = []; 

console.log('-------------------------');
console.log('CONFIGURATION MODULES');

for (const file of configurationFiles) {
	const configuration = require(`./commands/configuration/${file}`);
	commands.push(configuration.data.toJSON());
	client.commands.set(configuration.data.name, configuration);
	console.log("[✅]", configuration.data.name, "module activated !");
};

const infoFiles = fs.readdirSync('src/commands/info').filter(file => file.endsWith('.js'));

console.log('-------------------------');
console.log('INFO MODULES');

for (const file of infoFiles) {
	const info = require(`./commands/info/${file}`);
	commands.push(info.data.toJSON());
	client.commands.set(info.data.name, info);
	console.log("[✅]", info.data.name, "module activated !");
};

const funFiles = fs.readdirSync('src/commands/fun').filter(file => file.endsWith('.js'));

console.log('-------------------------');
console.log('FUN MODULES');

for (const file of funFiles) {
	const fun = require(`./commands/fun/${file}`);
	commands.push(fun.data.toJSON());
	client.commands.set(fun.data.name, fun);
	console.log("[✅]", fun.data.name, "module activated !");
};

const moderationFiles = fs.readdirSync('src/commands/moderation').filter(file => file.endsWith('.js'));

console.log('-------------------------');
console.log('MODERATION MODULES');

for (const file of moderationFiles) {
	const moderation = require(`./commands/moderation/${file}`);
	commands.push(moderation.data.toJSON());
	client.commands.set(moderation.data.name, moderation);
	console.log("[✅]", moderation.data.name, "module activated !");
};

console.log('-------------------------');

client.once('ready', () => {
	const CLIENT_ID = client.user.id;

	const rest = new REST({
		version: "9"
	}).setToken(token);

	(async() => {
		try {
			if (process.env.ENV === "production") {
				await rest.put(Routes.applicationCommands(CLIENT_ID) ,{
					body: commands
				});
				console.log("[COMMANDS 📚] Successfully registered commands");
			} else {
				await rest.put(Routes.applicationCommands(CLIENT_ID) ,{
					body: commands
				});
				console.log("[COMMANDS 📚] Successfully registered commands");
			}
		} catch (err) {
			if (err) console.error(err)
		}
	})();

	console.log('[BOT 🔧] Asgard ready !');
});

//////////////////////////////////////////
//				                        //
// INTERACTION SLASH COMMANDS / BUTTONS //
//				                        //
//////////////////////////////////////////

// IF THE COMMAND IS BROKEN //

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({ 
			content: 'There was an error while executing this command!', 
			ephemeral: true
	 	});
	}
});

// INTERACTION AVEC UN BOUTON //

client.on('interactionCreate', async interaction => {
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
					new MessageEmbed()
					.setColor(`RED`)
					.setAuthor({
						name: `ASGARD - COOLDOWN`,
						iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
					.setDescription(`**[⌛]** You are in **COOLDOWN**, please wait **10 seconds** before using a button again.`)
					.setFooter({
						text: "Asgard ⚖ | Link to fund."
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
						new MessageEmbed()
						.setColor(`#${config.embedColor}`)
						.setAuthor({
							name: `ASGARD - MODULES`,
							iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
						.setDescription('Here you can see every modules that Asgard has right now.\nYou can see the help by pressing the button and activate it by typing \n`/moduleactivate` or deactivate it by typing `/moduledeactivate`')
                		.addFields(
                    		{name : ':crossed_swords:  Custom Commands', value : 'Module for the custom commands system', inline : true},
                    		{name : ':bell: Notifications', value: 'Module for the twitch/youtube notification', inline: true},
                    		{name : ':page_facing_up: Logs', value: 'Module for the logs system', inline: true},
						)
						.setFooter({
							text: "Asgard ⚖ | Link to fund."})],
					components: [
						new MessageActionRow()
						.addComponents(
							new MessageButton()
							.setCustomId('custom_commands_help_modules')
							.setLabel('Custom Commands')
							.setStyle('SECONDARY')
							.setEmoji('⚔'),
							new MessageButton()
							.setCustomId('notifications_help_modules')
							.setLabel('Notifications')
							.setStyle('SECONDARY')
							.setEmoji('🔔'),
							new MessageButton()
							.setCustomId('logs_help_modules')
							.setLabel('Logs')
							.setStyle('SECONDARY')
							.setEmoji('📄'),
						),
					],
				});
			}
			else if(interaction.customId === 'moderation_help_modules') 
			{
				interaction.reply({
					embeds: [
						new MessageEmbed()
						.setColor(`#${config.embedColor}`)
						.setAuthor({
							name:"ASGARD - MODULES",
							iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
						.addFields(
							{name: 'Moderation', value: '/ban user | Ban the user from the server\n/kick user | Kick the user from the server'}
						)
						.setFooter({
							text:"Asgard ⚖ | Link to fund."})
					]
				})
			} 
			else if(interaction.customId === 'fun_help_modules') 
			{
				interaction.reply({
					embeds: [
						new MessageEmbed()
						.setColor(`#${config.embedColor}`)	
						.setAuthor({
							name:"ASGARD - MODULES",
							iconURL:"https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png"})
						.addFields(
							{name:'Fun', value: '/ping | Check if the bot respond'})
						.setFooter({
							text:"Asgard ⚖ | Link to fund."})
					]
				})
			}
		}
}});

/////////////////////////////////
//				               //
// LOGIN BOT TO DISCORD SERVER //
//				               //
/////////////////////////////////

client.login(token);