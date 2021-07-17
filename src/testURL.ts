import { liveStreamNotifier } from "./pubSubSubscriber";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import { DiscordMessenger } from "discord-messenger";

const discordBot = DiscordMessenger.getMessenger().getBot();

// const url = "https://www.youtube.com/watch?v=J-wP62z90Lk";
const url = "https://www.youtube.com/watch?v=3_mDtToNWLQ";
const author = "Gawr Gura";
dotenv.config();

discordBot.on("ready", async () => {
  await liveStreamNotifier.handleURL(author, url);
});
