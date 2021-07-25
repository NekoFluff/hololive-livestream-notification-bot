import { Command } from "discord-messenger";
import { liveStreamNotifier } from "../../pubSubSubscriber";

const ReloadURLCommand: Command = {
  name: "reload",
  description:
    "Reload a url\n`!reload <url>`",
  async execute(msg, args) {
    try {
      const url = args.map((value) => value)[0];
      await liveStreamNotifier.handleURL(url);
      msg.reply("Reloaded url");
    } catch (error) {
      msg.reply(
        "Oops. Something went wrong. Try again later. You can DM me ＠きつね#1040"
      );
      console.log(error);
    }
  },
};

export default ReloadURLCommand;
