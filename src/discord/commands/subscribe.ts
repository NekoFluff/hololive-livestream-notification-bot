import { Command } from "./index";
import subscriptionsDAO from "./../../dao/subscriptionDAO";

const SubscribeCommand: Command = {
  name: "subscribe",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member",
  async execute(msg, args) {
    const result = await subscriptionsDAO.addSubscriptions(msg.author.id, [
      args.join(" "),
    ]);
    if (result && result.insertedCount > 0) {
      msg.reply("Subscribed to " + args);
    } else {
      msg.reply(
        "Oops. Something went wrong. Try again later. You can DM me @Kitsune#1040"
      );
    }
  },
};

export default SubscribeCommand;
