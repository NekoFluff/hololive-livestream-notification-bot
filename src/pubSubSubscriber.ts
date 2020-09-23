import dotenv from "dotenv";
dotenv.config();
import pubSubHubBub from "pubsubhubbub";

var options = {
  callbackUrl: process.env.PUBSUBHUBBUB_CALLBACK || "",
};
var pubSubSubscriber = pubSubHubBub.createServer(options);

console.log("pubSubSubscriber options", options);
// console.log("pubSubSubscriber", pubSubSubscriber);

import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import transmitDeveloperNotification from "./discord/transmitDeveloperNotification";

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

pubSubSubscriber.on("feed", function (data: any) {
  console.log("-------------------FEED-------------------");
  transmitDeveloperNotification("Feed incomming!");
  transmitDeveloperNotification(data.feed.toString());

  console.log(data.topic + " feed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  console.log("Data feed:", data.feed);
  transmitDiscordNotification(data.feed);

  // console.log(data.feaders + " headers");
});

export default pubSubSubscriber;
