import dotenv from "dotenv";
import pubSubHubBub from "pubsubhubbub";
import parseYoutubeXMLIntoFeedData from "./discord/parseYoutubeXMLIntoFeedData";
import LiveStreamNotifier from "./liveStreamNotifier";
import { DiscordMessenger } from "discord-messenger";
import SubscriptionsRepository from "./repos/SubscriptionsRepository";
import { User } from "discord.js";
dotenv.config();

const subscriptionsRepo = new SubscriptionsRepository();

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
  // messenger.transmitDeveloperNotification("Feed incoming!");
  // messenger.transmitDeveloperNotification(data.feed.toString());

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
    const readableDate = liveStreamNotifier.convertUnixTimestampToReadableDate(liveStreamData?.streamTimestamp || 0);
    messenger.transmitDeveloperNotification(`Livestream timestamp ${liveStreamData?.streamTimestamp} (${readableDate}) is in the future: ${isFutureDate}`);

    if (liveStreamData && isFutureDate) {
      // messenger.transmitDeveloperNotification("Handling URL...");

      const newLivestreamScheduled = await liveStreamNotifier.handleURL(
        feedData.link
      );

      // messenger.transmitDeveloperNotification("Successfully handled URL...");

      if (newLivestreamScheduled) {
        console.log(`Readable date ${readableDate}`)
        messenger.transmitDiscordNotification(
          feedData.author,
          `[${feedData.author
          }] Livestream on ${readableDate}\n${feedData.link}`,
          {
            cooldownKey: "disabled",
            users: await getSubscribers(feedData.author)
          }
        );
      } else {
        messenger.transmitDeveloperNotification("Not scheduling livestream...");
      }

    } else {
      messenger.transmitDeveloperNotification(
        `Skipping transmission.`
      );
    }
  } else {
    messenger.transmitDeveloperNotification("Invalid feed data provided");
  }

  // console.log(data.headers + " headers");
});

export async function getSubscribers(author: string) {
  const names = author.toLocaleLowerCase().split(" ");
  const subscriptions = await subscriptionsRepo.getSubscriptionsForAuthors(names);

  const users: User[] = []

  for (const sub of subscriptions) {
    try {
      console.log(sub)
      const user = await messenger.getBot().users.fetch(sub['_id'] as any);
      if (user) {
        users.push(user);
      }
    } catch (error) {
      console.log(`Unable to get user ${sub.user}`)
    }
  }

  return users;
}

export default pubSubSubscriber;
