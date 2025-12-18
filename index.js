try {
  process.loadEnvFile();
} catch (e) {
  console.warn("No .env file found or supported, relying on system environment variables.");
}

const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const config = require('./config');
const loadEvents = require('./loaders/loadEvents');
const loadCommands = require('./loaders/loadCommands');

bot.commands = new Discord.Collection();
bot.login(config.token);
loadCommands(bot);
loadEvents(bot);