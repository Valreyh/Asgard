// Asgard 2021 | Start : 15/12/2021 //
// Func : Little Moderation, Fun, Info bot, Embed creator, My personal info, Level system (not with exp), help cmds //
// Asgard : the cleanest and simplist bot for your discord server //
// Author : Valreyh

//////////////////
//				//
// REQUIRED LIB //
//				//
//////////////////

require("dotenv").config()
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9") 
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');

//Cooldown
const cooldown = new Set();
const cooldownListMember = new Set();

///////////////////////
//					 //
// DEFINE BOT CLIENT //
//				     //
///////////////////////

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	] 
});

var token = process.env.TOKEN;

//////////////////////
//				    //
// COMMANDS HANDLER //
//				    //
//////////////////////

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

console.log(token);

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

// INTERACTION WITH A BUTTON //

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	if(interaction.isButton()){
		if(cooldown.has(interaction.member.id) && !cooldownListMember.has(interaction.member.id)) {
			cooldownListMember.add(interaction.member.id);
			setTimeout(() => {
				cooldownListMember.delete(interaction.member.id)
			}, 10000);
			interaction.reply({
				content: `**[COOLDOWN]** ${interaction.member}, wait 10 seconds before clicking on button again !`
			});
		} else if(cooldown.has(interaction.member.id) && cooldownListMember.has(interaction.member.id)) { 
			return;
		} else {
			cooldown.add(interaction.member.id);
			setTimeout(() => {
				cooldown.delete(interaction.member.id)
			}, 10000);
			if(interaction.customId === 'moderation_help_modules') {
				interaction.reply({
					embeds: [
						new MessageEmbed()
						.setColor('WHITE')
						.setAuthor('Asgard - Modules','https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png','https://discord.com')
						.addFields(
							{name: 'Moderation', value: '/ban user | Ban the user from the server\n/kick user | Kick the user from the server'}
						)
						.setFooter('Asgard ⚖ | Link to fund.')
					]
				})
			} else if(interaction.customId === 'fun_help_modules') {
				interaction.reply({
					content: 'FUN MODULES HERE'
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