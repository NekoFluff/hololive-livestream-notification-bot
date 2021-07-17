import { Command } from "discord-messenger";
import SubscriptionsRepository from "./../../repos/SubscriptionsRepository";

const subscriptionsRepo = new SubscriptionsRepository();

const UnsubscribeCommand: Command = {
  name: "unsubscribe",
  description:
    "Stop recieving direct messages (DMs) caused by using !subscribe.\n`!unsubscribe gawr gura amelia watson`",
  async execute(msg, args) {
    const result = await subscriptionsRepo.removeSubscriptions(
      msg.author.id,
      args.map((value) => value.toLocaleLowerCase())
    );

    if (result && result.deletedCount && result.deletedCount > 0) {
      msg.reply("Unsubscribed from " + args);
    } else {
      msg.reply(
        "Oops. Something went wrong. Try again later. You can DM me ＠きつね#1040"
      );
    }
  },
};

export default UnsubscribeCommand;
