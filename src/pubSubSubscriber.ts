import dotenv from "dotenv";
import pubSubHubBub from "pubsubhubbub";
import parseYoutubeXMLIntoFeedData from "./discord/parseYoutubeXMLIntoFeedData";
import LiveStreamNotifier from "./liveStreamNotifier";
import { DiscordMessenger } from "discord-messenger";
dotenv.config();

var messenger = DiscordMessenger.getMessenger();

var options = {
  callbackUrl: process.env.PUBSUBHUBBUB_CALLBACK || "",
};
var pubSubSubscriber = pubSubHubBub.createServer(options);

export const liveStreamNotifier = new LiveStreamNotifier();

console.log("pubSubSubscriber options", options);

pubSubSubscriber.on("subscribe", function (data: any) {
  console.log("-------------------SUBSCRIBE-------------------");
  console.log(data.topic + " subscribed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  messenger.transmitDeveloperNotification("Subscribed to " + data.topic);
});

pubSubSubscriber.on("unsubscribe", function (data: any) {
  console.log("-------------------UNSUBSCRIBE-------------------");
  console.log(data.topic + " unsubscribed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  messenger.transmitDeveloperNotification("Unsubscribed to " + data.topic);
});

pubSubSubscriber.on("feed", async function (data: any) {
  console.log("-------------------FEED-------------------");
  messenger.transmitDeveloperNotification("Feed incoming!");
  messenger.transmitDeveloperNotification(data.feed.toString());

  console.log(data.topic + " feed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  console.log("Data feed:" + data.feed.toString());
  const feedData = await parseYoutubeXMLIntoFeedData(data.feed);

  if (feedData) {
    // const embed = createEmbed(
    //   feedData.title,
    //   feedData.author,
    //   feedData.authorURL,
    //   feedData.link
    // );

    const liveStreamData = await liveStreamNotifier.isLivestream(feedData.link);
    const liveStreamDate = liveStreamData
      ? new Date(liveStreamData.streamTimestamp * 1000)
      : new Date();
    const currentDate = new Date();
    const isFutureDate = liveStreamDate > currentDate;
    messenger.transmitDeveloperNotification("Live stream data and future date");
    messenger.transmitDeveloperNotification(
      `IsFutureDate: ${isFutureDate}\nLiveStreamData: ${liveStreamData}`
    );

    if (liveStreamData && isFutureDate) {
      messenger.transmitDeveloperNotification("Handling URL...");

      const newLivestreamScheduled = await liveStreamNotifier.handleURL(
        feedData.author,
        feedData.link
      );

      messenger.transmitDeveloperNotification("Successfully handled URL...");

      if (newLivestreamScheduled)
        messenger.transmitDiscordNotification(
          feedData.author,
          `[${feedData.author
          }] Livestream on ${liveStreamNotifier.convertUnixTimestampToReadableDate(
            liveStreamData.streamTimestamp
          )}\n${feedData.link}`
        );
      else messenger.transmitDeveloperNotification("Not scheduling livestream...");
    } else {
      messenger.transmitDeveloperNotification(
        `Skipping transmition.\nIsFutureDate: ${isFutureDate}\nLiveStreamData: ${liveStreamData}`
      );
    }
    // else transmitDiscordNotification(feedData.author, embed);
  } else {
    messenger.transmitDeveloperNotification("Invalid feed data provided");
  }

  // console.log(data.headers + " headers");
});

export default pubSubSubscriber;
