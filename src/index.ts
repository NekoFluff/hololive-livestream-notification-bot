import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import subscriptionsDAO from "./dao/subscriptionDAO";
import pubSubSubscriber from "./pubSubSubscriber";
import app from "./server";
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
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });

function subscribe() {
  // var topics = [
  //   "https://superfeedr-blog-feed.herokuapp.com/",
  //   "https://www.youtube.com/channel/UCyl1z3jo3XHR1riLFKG5UAg", // Watson
  //   "https://www.youtube.com/channel/UCMwGHR0BTZuLsmjY_NT5Pwg", // Ninomae
  //   "https://www.youtube.com/channel/UCL_qhgtOy0dy1Agp8vkySQg", // Mori
  //   "https://www.youtube.com/channel/UCHsx4Hqa-1ORjQTh9TYDhww", // Takanashi
  //   "https://www.youtube.com/channel/UCoSrY_IQQVpmIRZ9Xf-y93g", // Gawr Gura
  // ];
  // var hub = "http://pubsubhubbub.appspot.com/";
  console.log("Subscribing to feeds...");
  var topics = ["http://push-pub.appspot.com/feed"];
  var hub = "https://pubsubhubbub.superfeedr.com";
  for (const topic of topics) {
    pubSubSubscriber.subscribe(topic, hub, function (err: any) {
      if (err) {
        console.log("Failed subscribing", err);
      }
    });
  }
}
subscribe();

let _reschedulerId = setInterval(() => {
  console.log("Re-subscribing...");
  subscribe();
}, 43100 * 1000);
