import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import fs from "fs";
import discordBot from "./discord/discordBot";
import parseYoutubeXMLIntoFeedData from "./discord/parseYoutubeXMLIntoFeedData";
import createEmbed from "./discord/createEmbed";
import LiveStreamNotifier from "./liveStreamNotifier";

discordBot.on("ready", () => {
  fs.readFile(__dirname + "/foo.xml", async function (err, data) {
    const feedData = await parseYoutubeXMLIntoFeedData(data);
    console.log("Feed Data", feedData);
    if (feedData) {
      const liveStreamNotifier = new LiveStreamNotifier();
      const embed = createEmbed(
        feedData.title,
        feedData.author,
        feedData.authorURL,
        feedData.link
      );

      const liveStreamData = await liveStreamNotifier.isLivestream(
        feedData.link
      );
      console.log("Live stream data", liveStreamData);
      if (liveStreamData)
        transmitDiscordNotification(
          feedData.author,
          `[${
            feedData.author
          }] Livestream on ${liveStreamNotifier.convertUnixTimestampToReadableDate(
            liveStreamData.streamTimestamp
          )}\n${feedData.link}`
        );
      else transmitDiscordNotification(feedData.author, embed);

      liveStreamNotifier.handleURL(feedData.author, feedData.link);
    }
  });
});
