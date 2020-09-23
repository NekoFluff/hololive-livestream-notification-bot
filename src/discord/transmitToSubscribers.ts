import { MessageEmbed } from "discord.js";
import subscriptionsDAO from "./../dao/subscriptionDAO";
import discordBot from "./discordBot";
import transmitDeveloperNotification from "./transmitDeveloperNotification";

async function transmitToSubscribers(author: string, embed: MessageEmbed) {
  const names = author.toLocaleLowerCase().split(" ");

  try {
    const subscriptions = await subscriptionsDAO.getSubscriptionsForAuthors(
      names
    );

    for (const sub of subscriptions) {
      console.log(sub["_id"] + " #" + sub["count"]);
      const user = discordBot.users.cache.get(sub["_id"]);
      if (user) user.send(embed);
    }
  } catch (e) {
    transmitDeveloperNotification(
      "Unable to send messages to subscribers: " + e
    );
  }
}

export default transmitToSubscribers;
