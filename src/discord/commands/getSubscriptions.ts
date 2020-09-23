import { Command } from "./index";
import subscriptionsDAO from "../../dao/subscriptionDAO";

const getSubscriptionsCommand: Command = {
  name: "getSubscriptions",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member",
  execute(msg, _args) {
    msg.reply("Retrieving subscriptions...");
    subscriptionsDAO.getSubscriptions(msg.author.id);
  },
};

export default getSubscriptionsCommand;
