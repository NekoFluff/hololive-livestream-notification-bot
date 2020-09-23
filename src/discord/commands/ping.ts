import { Command } from "./index";

const PingCommand: Command = {
  name: "ping",
  description: "Ping! Is the bot working?",
  execute(msg, _args) {
    msg.reply("pong");
    // msg.channel.send("pong");
  },
};

export default PingCommand;
