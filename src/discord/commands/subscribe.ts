import { Command } from "discord-messenger";
import SubscriptionsRepository from "./../../repos/SubscriptionsRepository";

const subscriptionRepo = new SubscriptionsRepository();

const SubscribeCommand: Command = {
  name: "subscribe",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member\n`!subscribe gawr gura amelia watson`",
  async execute(msg, args) {
    const result = await subscriptionRepo.addSubscriptions(
      msg.author.id,
      args.map((value) => value.toLocaleLowerCase())
    );
    if (result && result.insertedCount > 0) {
      msg.reply("Subscribed to " + args);
    } else {
      msg.reply(
        "Oops. Something went wrong. Try again later. You can DM me ＠きつね#1040"
      );
    }
  },
};

export default SubscribeCommand;
