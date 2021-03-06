const Discord = require('discord.js');
const fs = require('fs');

commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);

	commands.set(command.name, command);
}

module.exports = commands;
