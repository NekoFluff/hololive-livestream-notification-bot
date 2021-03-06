import { Command } from "discord-messenger";
import SubscriptionsRepository from "../../repos/SubscriptionsRepository";

const subscriptionRepo = new SubscriptionsRepository();

const getSubscriptionsCommand: Command = {
  name: "getsubs",
  description:
    "Get all your subscriptions registered with `!subscribe`.\n`!getsubs`",
  async execute(msg, args) {
    // msg.reply("Retrieving subscriptions...");
    try {
      const result = Object.values(await subscriptionRepo.getSubscriptions(msg.author.id));
      if (result.length > 0) {
        const response = result
          .map((value) => {
            return value["subscription"];
          })
          .join(", ");
        msg.reply("Subscriptions: " + response);
      } else {
        msg.reply("You don't have any subscriptions!");
      }
    } catch (e) {
      msg.reply(
        "Oops. Something went wrong. Try again later. You can DM me ＠きつね#1040"
      );
    }
  },
};

export default getSubscriptionsCommand;
