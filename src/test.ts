import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import fs from "fs";
import discordBot from "./discord/discordBot";
import parseYoutubeXML from "./discord/parseYoutubeXML";

discordBot.on("ready", () => {
  fs.readFile(__dirname + "/foo.xml", async function (err, data) {
    const embed = await parseYoutubeXML(data);
    if (embed && embed.author)
      transmitDiscordNotification(embed.author.name || "", embed);
  });
});
