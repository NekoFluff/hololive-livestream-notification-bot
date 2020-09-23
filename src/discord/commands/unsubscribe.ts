import { Command } from "./index";
import subscriptionsDAO from "./../../dao/subscriptionDAO";

const UnsubscribeCommand: Command = {
  name: "subscribe",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member",
  execute(msg, args) {
    msg.reply("Unsubscribed from " + args);
    subscriptionsDAO.removeSubscriptions(msg.author.id, [args.join(" ")]);
  },
};

export default UnsubscribeCommand;
