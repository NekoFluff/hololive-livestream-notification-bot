import { Commands } from "discord-messenger";
import PingCommand from "./ping";
import UnsubscribeCommand from "./unsubscribe";
import SubscribeCommand from "./subscribe";
import GetSubscriptionsCommand from "./getSubscriptions";
import HelpCommand from "./help";

const commands: Commands = {
  Subscribe: SubscribeCommand,
  UnsubscribeCommand: UnsubscribeCommand,
  GetSubscriptionsCommand: GetSubscriptionsCommand,
  Ping: PingCommand,
  HelpCommand: HelpCommand,
};

export default commands;
