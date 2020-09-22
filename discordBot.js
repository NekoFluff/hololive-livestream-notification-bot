require("dotenv").config();

const { Client, Collection } = require("discord.js");
const bot = new Client();
bot.commands = new Collection();
const botCommands = require("./commands");
const prefix = process.env.PREFIX || "!"

Object.keys(botCommands).map((key) => {
  bot.commands.set(botCommands[prefix+key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("there was an error trying to execute that command!");
  }
});

module.exports = bot;
