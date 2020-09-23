const discordBot = require("./discordBot");
const { MessageEmbed } = require("discord.js");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();

function transmitDiscordNotification(xml) {
  parser.parseString(xml, function (err, result) {
    const feed = result["feed"];

    for (const entry of feed.entry) {
      const author = entry.author[0].name[0];
      const authorURL = entry.author[0].uri[0];
      const title = entry.title[0];
      const published = entry.published[0];
      const link = entry.link[0]["$"].href;
      const updated = entry.updated[0];

      for (const [key, guild] of discordBot.guilds.cache) {
        const channel = guild.channels.cache.find(
          (ch) => ch.name === "hololive-notifications"
        );

        const embed = new MessageEmbed()
          .setTitle(title)
          .setAuthor(author, (url = authorURL))
          .setURL(link)
          .setDescription(`Published ${published}`)
          .setColor(0xff0000);

        channel.send(embed);
      }
    }
  });
}

export default transmitDiscordNotification;
