import cors from "cors";
import morgan from "morgan";
import pubSubSubscriber from "./pubSubSubscriber";

import express, { Request, Response, NextFunction } from "express";

import { DiscordMessenger } from "discord-messenger";
import commands from "./discord/commands";

var messenger = DiscordMessenger.getMessenger();
messenger.getBot(commands);

const app = express();

import dotenv from "dotenv";
dotenv.config();
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
