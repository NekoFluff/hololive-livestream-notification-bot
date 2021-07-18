import { Command } from "discord-messenger";
import SubscriptionsRepository from "./../../repos/SubscriptionsRepository";

const subscriptionsRepo = new SubscriptionsRepository();

const SubscribeCommand: Command = {
  name: "subscribe",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member\n`!subscribe gawr gura amelia watson`",
  async execute(msg, args) {
    const authors = args.map((value) => value.toLocaleLowerCase());
    const existingSubs = Object.values(await subscriptionsRepo.getSubscriptions(msg.author.id)).map((sub) => { return sub['subscription'] });
    const duplicates: string[] = [];
    const newAuthors = authors.filter(function (author) {
      if (existingSubs.includes(author)) {
        duplicates.push(author);
        return false; // Don't include
      }
      return true;
    });

    if (duplicates.length > 0) {
      msg.reply(
        `Looks like you're already subscribed to these: ${duplicates.join(", ")}`
      );
    }

    if (newAuthors.length === 0) {
      msg.reply(
        `I don't see any new subscription names in the list you provided. Did you type everything in right?`
      );
      return;
    }

    const result = await subscriptionsRepo.addSubscriptions(
      msg.author.id,
      newAuthors
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
