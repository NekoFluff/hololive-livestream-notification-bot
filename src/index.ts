import dotenv from "dotenv";
import app from "./server";
import { MongoClient } from "mongodb";
import scheduledLivestreamsDAO from "./dao/scheduledLivestreamsDAO";
import subscriptionsDAO from "./dao/subscriptionDAO";
import feedsDAO, { Feed } from "./dao/feedsDAO";
import pubSubSubscriber, { liveStreamNotifier } from "./pubSubSubscriber";
dotenv.config();

const port = process.env.PORT || 3000;
MongoClient.connect(
  process.env.DATABASE_URI ||
  "Invalid DB URI. Please add DATABASE_URI to .env file",

  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 50,
    wtimeout: 2500,
  }
  // Catch any errors with starting the server
)
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
    // On success, inject the client connection to every DAO (data access object)
  })
  .then(async (clientConnection) => {
    await subscriptionsDAO.injectDB(clientConnection);
    await scheduledLivestreamsDAO.injectDB(clientConnection);
    await feedsDAO.injectDB(clientConnection);
    liveStreamNotifier.getScheduleFromMongoDB();

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });

    var feeds = await feedsDAO.getFeeds();
    subscribe(feeds);

    // Reschedule feeds
    setInterval(() => {
      console.log("Re-subscribing to feeds...");
      subscribe(feeds);
    }, 43100 * 1000);
  });

function subscribe(feeds: Feed[]) {
  var hub = "http://pubsubhubbub.appspot.com/";

  console.log("Subscribing to feeds...");
  // var topics = ["http://push-pub.appspot.com/feed"];
  // var hub = "https://pubsubhubbub.superfeedr.com";
  for (const feed of feeds) {
    pubSubSubscriber.subscribe(feed.topicURL, hub, function (err: any) {
      if (err) {
        console.log("Failed subscribing", err);
      } else {
        console.log(
          "Subscribed to feed: " + feed.firstName + " " + feed.topicURL
        );
      }
    });
  }
  console.log("Finished subscribing to feeds...");
}
