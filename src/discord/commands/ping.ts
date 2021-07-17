import { Command } from "discord-messenger";

const PingCommand: Command = {
  name: "ping",
  description: "Let's play ping pong! Is the bot working?",
  execute(msg, _args) {
    msg.reply("pong");
    // msg.channel.send("pong");
  },
};

export default PingCommand;
