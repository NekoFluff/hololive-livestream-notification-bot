import { Message } from "discord.js";
import PingCommand from "./ping";
import UnsubscribeCommand from "./unsubscribe";
import SubscribeCommand from "./subscribe";
import GetSubscriptionsCommand from "./getSubscriptions";

export type Command = {
  name: string;
  description: string;
  execute: (msg: Message, args: string[]) => any;
};

export type Commands = {
  [key: string]: Command;
};

const commands: Commands = {
  Ping: PingCommand,
  Subscribe: UnsubscribeCommand,
  UnsubscribeCommand: SubscribeCommand,
  GetSubscriptionsCommand: GetSubscriptionsCommand,
};

export default commands;
