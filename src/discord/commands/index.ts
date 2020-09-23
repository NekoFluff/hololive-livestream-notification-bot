import ping from "./ping";

import { Message } from "discord.js";

export type Command = {
  name: string;
  description: string;
  execute: (msg: Message, args: string[]) => any;
};

export type Commands = {
  [key: string]: Command;
};

const commands: Commands = {
  Ping: require("./ping"),
  Subscribe: require("./subscribe"),
  UnsubscribeCommand: require("./unsubscribe"),
  GetSubscriptionsCommand: require("./getSubscriptions"),
};

export default commands;
