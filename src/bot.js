// Asgard 2021 | Start : 15/12/2021 //
// Fonctions : De la modération légère, un module de fun, Info bot, un créateur d'embed, système de notif, système de logs, des help commandes //
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
const { Client, Collection, IntentsBitField } = require('discord.js');
const { Embed } = require("@discordjs/builders");
const moongose = require('mongoose');

///////////////////////////////
//				             //
// LECTURE DU FICHIER CONFIG //
//				             //
///////////////////////////////

const path = require('path');
const { default: mongoose } = require("mongoose");
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

/////////////////////////////////
//					           //
// ON DEFINIE LE CLIENT DU BOT //
//				               //
/////////////////////////////////

const client = new Client({
	intents: [
	  IntentsBitField.Flags.Guilds,
	  IntentsBitField.Flags.GuildMessages,
	  IntentsBitField.Flags.DirectMessages,
	  IntentsBitField.Flags.MessageContent,
	],
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

console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░██╗░░░░██╗░░░░░░░░░░░░░░░░░░░░░░░░░░");
console.log("░░░░░░░░░░░░██████╗██████╗╚██╗░░██╔╝██████╗██████╗░░░░░░░░░░░░");
console.log("█████╗█████╗╚═════╝╚═════╝░╚██╗██╔╝░╚═════╝╚═════╝█████╗█████╗");
console.log("╚════╝╚════╝██████╗██████╗░██╔╝╚██╗░██████╗██████╗╚════╝╚════╝");
console.log("░░░░░░░░░░░░╚═════╝╚═════╝██╔╝░░╚██╗╚═════╝╚═════╝░░░░░░░░░░░░");
console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░╚═╝░░░░╚═╝░░░░░░░░░░░░░░░░░░░░░░░░░░");
console.log("      ░█████╗░░██████╗░██████╗░░█████╗░██████╗░██████╗░  ");
console.log("      ██╔══██╗██╔════╝██╔════╝░██╔══██╗██╔══██╗██╔══██╗  ");
console.log("      ███████║╚█████╗░██║░░██╗░███████║██████╔╝██║░░██║  ");
console.log("      ██╔══██║░╚═══██╗██║░░╚██╗██╔══██║██╔══██╗██║░░██║  ");
console.log("      ██║░░██║██████╔╝╚██████╔╝██║░░██║██║░░██║██████╔╝  ");
console.log("      ╚═╝░░╚═╝╚═════╝░░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░  ");
console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░██╗░░░░██╗░░░░░░░░░░░░░░░░░░░░░░░░░░");
console.log("░░░░░░░░░░░░██████╗██████╗╚██╗░░██╔╝██████╗██████╗░░░░░░░░░░░░");
console.log("█████╗█████╗╚═════╝╚═════╝░╚██╗██╔╝░╚═════╝╚═════╝█████╗█████╗");
console.log("╚════╝╚════╝██████╗██████╗░██╔╝╚██╗░██████╗██████╗╚════╝╚════╝");
console.log("░░░░░░░░░░░░╚═════╝╚═════╝██╔╝░░╚██╗╚═════╝╚═════╝░░░░░░░░░░░░");
console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░╚═╝░░░░╚═╝░░░░░░░░░░░░░░░░░░░░░░░░░░");

console.log('-------------------------');
console.log('CONFIGURATION MODULES');

for (const file of configurationFiles) {
	const configuration = require(`./commands/configuration/${file}`);
	commands.push(configuration.data.toJSON());
	client.commands.set(configuration.data.name, configuration);
	console.log("[✅]", configuration.data.name, "command activated !");
};

const infoFiles = fs.readdirSync('src/commands/info').filter(file => file.endsWith('.js'));

console.log('-------------------------');
console.log('INFO MODULES');

for (const file of infoFiles) {
	const info = require(`./commands/info/${file}`);
	commands.push(info.data.toJSON());
	client.commands.set(info.data.name, info);
	console.log("[✅]", info.data.name, "command activated !");
};

const embedCreatorFiles = fs.readdirSync('src/commands/embedcreator').filter(file => file.endsWith('.js'));

console.log('-------------------------');
console.log('EMBED CREATOR MODULE');

for (const file of embedCreatorFiles) {
	const embedCreator = require(`./commands/embedcreator/${file}`);
	commands.push(embedCreator.data.toJSON());
	client.commands.set(embedCreator.data.name, embedCreator);
	console.log("[✅]", embedCreator.data.name, "command activated !");
};

const utilityFiles = fs.readdirSync('src/commands/utility').filter(file => file.endsWith('.js'));

console.log('-------------------------');
console.log('UTILITY MODULE');

for (const file of utilityFiles) {
	const utility = require(`./commands/utility/${file}`);
	commands.push(utility.data.toJSON());
	client.commands.set(utility.data.name, utility);
	console.log("[✅]", utility.data.name, "command activated !");
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

		// Database part

		if(!process.env.MONGODB_URL) return;

		await moongose.connect(process.env.MONGODB_URL || '', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		if(mongoose.connect) {
			console.log('[DB 📁✅] Asgard connected to the database !')
		} else {
			console.log('[DB 📁❌] Asgard caannot connect to the database ... !')
		}

	})();

	console.log('[BOT 🔧] Asgard ready !');

});

// ON GERE LES EVENTS A UN MESSAGE POSTE

client.on('messageCreate', async message => {
	const chatFilterEvent = require('./events/chatFilterEvent');
	chatFilterEvent(message, client);
});

// ON GERE LES EVENT QUAND ON CREE UNE INTERACTION

client.on('interactionCreate', async interaction => {
	require('./events/buttonEvent')(interaction, client);
});

////////////////////////////////
//				              //
// INTERACTION SLASH COMMANDS //
//				              //
////////////////////////////////

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
			content: 'There was an error while executing this command! Contact the bot owner using /botinfo', 
			ephemeral: true
	 	});
	}
});

/////////////////////////////////
//				               //
// LOGIN BOT TO DISCORD SERVER //
//				               //
/////////////////////////////////

client.login(token);