import { Command } from "./index";
import subscriptionsDAO from "./../../dao/subscriptionDAO";

const SubscribeCommand: Command = {
  name: "subscribe",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member",
  execute(msg, args) {
    msg.reply("Subscribed to " + args);
    subscriptionsDAO.addSubscriptions(msg.author.id, [args.join(" ")]);
  },
};

export default SubscribeCommand;
