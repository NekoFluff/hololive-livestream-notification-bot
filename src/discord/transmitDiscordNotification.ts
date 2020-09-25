import { MessageEmbed } from "discord.js";
import transmitToSubscribers from "./transmitToSubscribers";
import transmitToServers from "./transmitToServers";

const onCooldown: { [key: string]: boolean } = {};
const cooldownTimer = 60 * 1000; // 60 second cooldown

function transmitDiscordNotification(
  author: string,
  embed: MessageEmbed | string
) {
  const key = author + embed.toString();

  if (onCooldown[key]) return;
  onCooldown[key] = true;

  setTimeout(() => {
    onCooldown[key] = false;
  }, cooldownTimer);

  // Transmit to subscribers
  transmitToSubscribers(author, embed);

  // Transmit to servers
  transmitToServers(embed);
}

export default transmitDiscordNotification;
