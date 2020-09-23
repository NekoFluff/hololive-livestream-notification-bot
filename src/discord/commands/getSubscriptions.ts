import { Command } from "./index";
import subscriptionsDAO from "../../dao/subscriptionDAO";

const getSubscriptionsCommand: Command = {
  name: "getsubscriptions",
  description:
    "Recieve notifications by direct messages (DMs) for a hololive-EN member",
  async execute(msg, args) {
    msg.reply("Retrieving subscriptions...");
    try {
      const result = await subscriptionsDAO.getSubscriptions(msg.author.id);
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
        "Oops. Something went wrong. Try again later. You can DM me @Kitsune#1040"
      );
    }
  },
};

export default getSubscriptionsCommand;
