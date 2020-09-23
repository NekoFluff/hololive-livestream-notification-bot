import transmitDiscordNotification from "./discord/transmitDiscordNotification";
import fs from "fs";
import discordBot from "./discord/discordBot";

discordBot.on("ready", () => {
  fs.readFile(__dirname + "/foo.xml", function (err, data) {
    transmitDiscordNotification(data);
  });
});
