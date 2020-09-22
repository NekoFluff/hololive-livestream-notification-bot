require("dotenv").config();

var pubSubHubbub = require("pubsubhubbub");
var options = {
  callbackUrl: process.env.PUBSUBHUBBUB_CALLBACK,
};
var pubSubSubscriber = pubSubHubbub.createServer(options);
console.log("pubSubSubscriber options", options);
console.log("pubSubSubscriber", pubSubSubscriber);
const transmitDiscordNotification = require("./transmitDiscordNotification");
const transmitDeveloperNotification = require("./transmitDeveloperNotification");

pubSubSubscriber.on("subscribe", function (data) {
  console.log("-------------------SUBSCRIBE-------------------");
  console.log(data.topic + " subscribed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  transmitDeveloperNotification("Subscribed to " + data.topic);
});

pubSubSubscriber.on("unsubscribe", function (data) {
  console.log("-------------------UNSUBSCRIBE-------------------");
  console.log(data.topic + " unsubscribed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
});

pubSubSubscriber.on("feed", function (data) {
  console.log("-------------------FEED-------------------");

  console.log(data.topic + " feed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
  console.log(data.feed);
  transmitDiscordNotification(data.feed);

  // console.log(data.feaders + " headers");
});

module.exports = pubSubSubscriber;
