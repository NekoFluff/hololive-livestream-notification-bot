import dotenv from "dotenv";
import pubSubHubBub from "pubsubhubbub";
import parseYoutubeXMLIntoFeedData from "./discord/parseYoutubeXMLIntoFeedData";
import transmitDeveloperNotification from "./discord/transmitDeveloperNotification";
// console.log("pubSubSubscriber", pubSubSubscriber);
import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import LiveStreamNotifier from "./liveStreamNotifier";
import createEmbed from "./discord/createEmbed";
dotenv.config();

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
  transmitDeveloperNotification("Subscribed to " + data.topic);
});

pubSubSubscriber.on("unsubscribe", function (data: any) {
  console.log("-------------------UNSUBSCRIBE-------------------");
  console.log(data.topic + " unsubscribed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  transmitDeveloperNotification("Unsubscribed to " + data.topic);
});

pubSubSubscriber.on("feed", async function (data: any) {
  console.log("-------------------FEED-------------------");
  transmitDeveloperNotification("Feed incoming!");
  transmitDeveloperNotification(data.feed.toString());

  console.log(data.topic + " feed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  console.log("Data feed:" + data.feed.toString());
  const feedData = await parseYoutubeXMLIntoFeedData(data.feed);

  if (feedData) {
    const embed = createEmbed(
      feedData.title,
      feedData.author,
      feedData.authorURL,
      feedData.link
    );

    const liveStreamData = await liveStreamNotifier.isLivestream(feedData.link);
    const liveStreamDate = liveStreamData
      ? new Date(liveStreamData.streamTimestamp * 1000)
      : new Date();
    const currentDate = new Date();
    const isFutureDate = liveStreamDate > currentDate;
    if (liveStreamData && isFutureDate) {
      const newLivestreamScheduled = liveStreamNotifier.handleURL(
        feedData.author,
        feedData.link
      );

      if (newLivestreamScheduled)
        transmitDiscordNotification(
          feedData.author,
          `[${
            feedData.author
          }] Livestream on ${liveStreamNotifier.convertUnixTimestampToReadableDate(
            liveStreamData.streamTimestamp
          )}\n${feedData.link}`
        );
    } else {
      transmitDeveloperNotification(
        `Skipping transmittion.\nIsFutureDate: ${isFutureDate}\nLiveStreamData: ${liveStreamData}`
      );
    }
    // else transmitDiscordNotification(feedData.author, embed);
  } else {
    transmitDeveloperNotification("Invalid feed data provided");
  }

  // console.log(data.headers + " headers");
});

export default pubSubSubscriber;
