const discordBot = require("./discordBot");
const { MessageEmbed } = require("discord.js");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();

function transmitDiscordNotification(message) {
  // console.log(discordBot.users);
  discordBot.users.cache.get("142090800279453696").send(message);
}

module.exports = transmitDiscordNotification;
