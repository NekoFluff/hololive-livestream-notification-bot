import { MessageEmbed } from "discord.js";
import transmitToSubscribers from "./transmitToSubscribers";
import transmitToServers from "./transmitToServers";

const onCooldown: { [key: string]: boolean } = {};
const cooldownTimer = 5 * 60 * 1000; // 5 minute cooldown

function transmitDiscordNotification(
  author: string,
  embed: MessageEmbed | string
) {
  const key = author + embed.toString();

  if (onCooldown[key] === true) {
    console.log(author + " on cooldown");
    return;
  }
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
