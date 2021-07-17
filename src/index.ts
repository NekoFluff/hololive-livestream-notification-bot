import dotenv from "dotenv";
import app from "./server";
import FeedsRepository, { Feed } from "./repos/FeedsRepository";
import pubSubSubscriber, { liveStreamNotifier } from "./pubSubSubscriber";
dotenv.config();

const port = process.env.PORT || 3000;

async function startup() {
  await liveStreamNotifier.getScheduleFromMongoDB();

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  const feedsRepo = new FeedsRepository();
  var feeds = Object.values(await feedsRepo.getFeeds());
  // await unsubscribe(feeds);
  await subscribe(feeds);

  // Reschedule feeds
  setInterval(async () => {
    console.log("Re-subscribing to feeds...");
    await subscribe(feeds);
  }, 43100 * 1000);
}

startup();

async function subscribe(feeds: Feed[]) {
  var hub = "http://pubsubhubbub.appspot.com/";

  console.log("Subscribing to feeds...");
  // var topics = ["http://push-pub.appspot.com/feed"];
  // var hub = "https://pubsubhubbub.superfeedr.com";
  for (const feed of feeds) {
    await new Promise(r => setTimeout(r, 500));

    pubSubSubscriber.subscribe(feed.topicURL, hub, function (err: any) {
      if (err) {
        console.log("Failed subscribing", err);
      } else {
        console.log(
          "Successfully subscribed to feed: " + feed.firstName + " " + feed.topicURL
        );
      }
    });
  }
  console.log("Finished subscribing to feeds...");
}

async function unsubscribe(feeds: Feed[]) {
  var hub = "http://pubsubhubbub.appspot.com/";

  console.log("Unsubscribing from feeds...");
  // var topics = ["http://push-pub.appspot.com/feed"];
  // var hub = "https://pubsubhubbub.superfeedr.com";
  for (const feed of feeds) {
    await new Promise(r => setTimeout(r, 500));

    pubSubSubscriber.unsubscribe(feed.topicURL, hub, function (err: any) {
      if (err) {
        console.log("Failed unsubscribing", err);
      } else {
        console.log(
          "Successfully unsubscribed from feed: " + feed.firstName + " " + feed.topicURL
        );
      }
    });
  }
  console.log("Finished unsubscribing from feeds...");
}
