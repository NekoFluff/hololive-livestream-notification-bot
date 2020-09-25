// Execute to print out the stats for the bot

import bot from "./discord/discordBot";

bot.on("ready", () => {
  // console.info(`Logged in as ${bot.user!.tag}!`);
  console.log("===============[[Stats]]================");
  console.log("Guild Count: " + bot.guilds.cache.size);
  for (const [key, guild] of bot.guilds.cache) {
    console.log(key, guild.name);
  }
  console.log();
});
