import { Message } from "discord.js";
import PingCommand from "./ping";
import UnsubscribeCommand from "./unsubscribe";
import SubscribeCommand from "./subscribe";
import GetSubscriptionsCommand from "./getSubscriptions";
import HelpCommand from "./help";

export type Command = {
  name: string;
  description: string;
  execute: (msg: Message, args: string[]) => any;
};

export type Commands = {
  [key: string]: Command;
};

const commands: Commands = {
  Subscribe: SubscribeCommand,
  UnsubscribeCommand: UnsubscribeCommand,
  GetSubscriptionsCommand: GetSubscriptionsCommand,
  Ping: PingCommand,
  HelpCommand: HelpCommand,
};

export default commands;
