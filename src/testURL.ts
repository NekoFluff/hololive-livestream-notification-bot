import { liveStreamNotifier } from "./pubSubSubscriber";
import { MongoClient } from "mongodb";
import scheduledLivestreamsDAO from "./dao/scheduledLivestreamsDAO";
import subscriptionsDAO from "./dao/subscriptionDAO";
import feedsDAO, { Feed } from "./dao/feedsDAO";
import dotenv from "dotenv";

import { DiscordMessenger } from "discord-messenger";

const discordBot = DiscordMessenger.getMessenger().getBot();

// const url = "https://www.youtube.com/watch?v=J-wP62z90Lk";
const url = "https://www.youtube.com/watch?v=3_mDtToNWLQ";
const author = "Gawr Gura";
dotenv.config();

discordBot.on("ready", () => {
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
      liveStreamNotifier.handleURL(author, url);
    });
});
