import discordBot from "./discordBot";
import { MessageEmbed, Channel, TextChannel } from "discord.js";
import xml2js from "xml2js";
import transmitDeveloperNotification from "./transmitDeveloperNotification";

const parser = new xml2js.Parser();

function transmitDiscordNotification(xml: string) {
  parser.parseString(xml, function (err: Error, result: any) {
    if (err) {
      console.error(err);
      return;
    }

    const feed = result["feed"];

    try {
      for (const entry of feed.entry) {
        const author = entry.author[0].name[0];
        const authorURL = entry.author[0].uri[0];
        const title = entry.title[0];
        const published = entry.published[0];
        const link = entry.link[0]["$"].href;
        // const updated = entry.updated[0];

        for (const [_key, guild] of discordBot.guilds.cache) {
          const channel = guild.channels.cache.find(
            (ch) => ch.name === "hololive-notifications"
          );
          if (channel && channel.type === "text") {
            const embed = new MessageEmbed()
              .setTitle(title)
              .setAuthor(author, undefined, authorURL)
              .setURL(link)
              .setDescription(`Published ${published}`)
              .setColor(0xff0000);

            (channel as TextChannel).send(embed);
          }
        }
      }
    } catch (e) {
      transmitDeveloperNotification(e.toString());
    }
  });
}

export default transmitDiscordNotification;
