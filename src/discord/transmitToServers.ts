import discordBot from "./discordBot";
import { MessageEmbed, TextChannel } from "discord.js";

function transmitToServers(embed: MessageEmbed | string) {
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
      if (typeof embed === "string") (channel as TextChannel).send(embed);
      else
        (channel as TextChannel).send(
          embed.url ? `${embed.title}: ${embed.url}` : embed
        );
    }
  }
}

export default transmitToServers;
