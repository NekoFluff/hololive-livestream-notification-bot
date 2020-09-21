const transmitDiscordNotification = require("./transmitDiscordNotification");

var fs = require("fs");

const discordBot = require("./discordBot");

discordBot.on("ready", () => {
  fs.readFile(__dirname + "/foo.xml", function (err, data) {
    transmitDiscordNotification(data);
  });
});
