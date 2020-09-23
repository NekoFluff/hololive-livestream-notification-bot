import dotenv from "dotenv"
dotenv.config(); 

import { Client, Collection } from "discord.js"
const bot = new Client();
const storedBotCommands = new Collection();
import botCommands, {Command} from "./commands/index"
const prefix = process.env.PREFIX || "!"

Object.keys(botCommands).map((key: string) => {
  storedBotCommands.set(prefix + botCommands[key].name as string, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user!.tag}!`);
});

bot.on("message", (msg) => {
  const args = msg.content.split(/ +/)
  let command = args.shift() || "";
  command = command.toLocaleLowerCase()
  console.info(`Called command: ${command}`);

  if (!storedBotCommands.has(command)) return;

  try {
    const storedCommand = storedBotCommands.get(command) as Command
    storedCommand.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("there was an error trying to execute that command!");
  }
});

export default bot;
