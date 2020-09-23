import {Command} from "./index"

const PingCommand : Command = {
  name: "ping",
  description: "Ping!",
  execute(msg, _args) {
    msg.reply("pong");
    // msg.channel.send("pong");
  },
}

export default PingCommand;
