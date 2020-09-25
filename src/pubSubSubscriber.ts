import dotenv from "dotenv";
import pubSubHubBub from "pubsubhubbub";
import parseYoutubeXML from "./discord/parseYoutubeXML";
import transmitDeveloperNotification from "./discord/transmitDeveloperNotification";
// console.log("pubSubSubscriber", pubSubSubscriber);
import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import LiveStreamNotifier from "./liveStreamNotifier";
dotenv.config();

var options = {
  callbackUrl: process.env.PUBSUBHUBBUB_CALLBACK || "",
};
var pubSubSubscriber = pubSubHubBub.createServer(options);

const liveStreamNotifier = new LiveStreamNotifier();

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
  transmitDeveloperNotification("Feed incomming!");
  transmitDeveloperNotification(data.feed.toString());

  console.log(data.topic + " feed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  console.log("Data feed:", data.feed);
  const embed = await parseYoutubeXML(data.feed);
  if (embed) {
    if (embed.author && embed.author.name) {
      transmitDiscordNotification(embed.author.name, embed);
      if (embed.url)
        liveStreamNotifier.handleURL(embed.author.name!, embed.url);
    }
  }

  // console.log(data.headers + " headers");
});

export default pubSubSubscriber;
