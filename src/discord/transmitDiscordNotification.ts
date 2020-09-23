import discordBot from "./discordBot";
import { MessageEmbed, Channel, TextChannel } from "discord.js";
import xml2js from "xml2js";
import transmitDeveloperNotification from "./transmitDeveloperNotification";
import transmitToSubscribers from "./transmitToSubscribers";

const parser = new xml2js.Parser();

function transmitDiscordNotification(xml: string | Buffer) {
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
        const embed = new MessageEmbed()
          .setTitle(title)
          .setAuthor(author, undefined, authorURL)
          .setURL(link)
          .setDescription(`Published ${published}`)
          .setColor(0xff0000);

        // Transmit to subscribers
        transmitToSubscribers(author, embed);

        // Transmit to servers
        for (const [_key, guild] of discordBot.guilds.cache) {
          const channel = guild.channels.cache.find(
            (ch) => ch.name === "hololive-notifications"
          );
          if (channel && channel.type === "text") {
            // Skip non-developer servers when developer mode is on
            if (
              process.env.DEVELOPER_MODE === "on" &&
              !(
                channel.guild.id === "757705063878623343" ||
                channel.guild.id === "757774890366664774"
              )
            )
              continue;
            (channel as TextChannel).send(embed);
          }
        }
      }
    } catch (e) {
      transmitDeveloperNotification("Error: " + e.toString());
    }
  });
}

export default transmitDiscordNotification;
