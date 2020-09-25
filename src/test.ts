import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import fs from "fs";
import discordBot from "./discord/discordBot";
import parseYoutubeXMLIntoFeedData from "./discord/parseYoutubeXMLIntoFeedData";
import createEmbed from "./discord/createEmbed";

discordBot.on("ready", () => {
  fs.readFile(__dirname + "/foo.xml", async function (err, data) {
    const feedData = await parseYoutubeXMLIntoFeedData(data);
    if (feedData) {
      const embed = createEmbed(
        feedData.title,
        feedData.author,
        feedData.authorURL,
        feedData.link
      );
      transmitDiscordNotification(feedData.author || "", embed);
    }
  });
});
