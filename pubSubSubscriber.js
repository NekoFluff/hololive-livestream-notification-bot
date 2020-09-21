var pubSubHubbub = require("pubsubhubbub");
var options = {
  callbackUrl: "http://crazy-raspberry.myddns.me:88/pubsubhubbub",
};
var pubSubSubscriber = pubSubHubbub.createServer(options);

const transmitDiscordNotification = require("./transmitDiscordNotification");

pubSubSubscriber.on("subscribe", function (data) {
  console.log("-------------------SUBSCRIBE-------------------");
  console.log(data.topic + " subscribed");
  // console.log(data.hub + " hub");
  // console.log(data.callback + " callback");
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
