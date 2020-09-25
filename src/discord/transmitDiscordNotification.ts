import { MessageEmbed } from "discord.js";
import transmitToSubscribers from "./transmitToSubscribers";
import transmitToServers from "./transmitToServers";

function transmitDiscordNotification(
  author: string,
  embed: MessageEmbed | string
) {
  // Transmit to subscribers
  transmitToSubscribers(author, embed);

  // Transmit to servers
  transmitToServers(embed);
}

export default transmitDiscordNotification;
