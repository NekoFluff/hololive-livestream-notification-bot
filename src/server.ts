import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import morgan from "morgan";
import pubSubSubscriber from "./pubSubSubscriber";

import express, { Request, Response, NextFunction } from "express";

import commands from "./discord/commands";

import { DiscordMessenger } from "discord-messenger";
var messenger = DiscordMessenger.getMessenger({
  defaultChannelName: process.env.DM_DEFAULT_CHANNEL_NAME ?? "general",
  commandPrefix: process.env.DM_COMMAND_PREFIX ?? "!",
  token: process.env.DM_BOT_TOKEN ?? "",
  developerMode: process.env.DM_DEVELOPER_MODE === "on",
});
messenger.getBot(commands);



const app = express();

import helmet from "helmet";
import bodyParser from "body-parser";

// Middleware
const corsOptions = {
  exposedHeaders: "X-Auth-Token",
};

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Api routes below
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("Um. You weren't suppose to find this");
});

app.use("/pubsubhubbub", pubSubSubscriber.listener());

export default app;
