"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var discord_js_1 = require("discord.js");
var bot = new discord_js_1.Client();
var storedBotCommands = new discord_js_1.Collection();
var index_1 = __importDefault(require("./commands/index"));
var prefix = process.env.PREFIX || "!";
console.log("Commands: ");
Object.keys(index_1.default).map(function (key) {
    console.log(prefix + index_1.default[key].name);
    storedBotCommands.set(prefix + index_1.default[key].name, index_1.default[key]);
});
var TOKEN = process.env.TOKEN;
bot.login(TOKEN);
bot.on("ready", function () {
    console.info("Logged in as " + bot.user.tag + "!");
});
bot.on("message", function (msg) {
    var args = msg.content.split(/ +/);
    var command = args.shift() || "";
    command = command.toLocaleLowerCase();
    console.info("Called command: " + command);
    if (!storedBotCommands.has(command))
        return;
    try {
        var storedCommand = storedBotCommands.get(command);
        storedCommand.execute(msg, args);
    }
    catch (error) {
        console.error(error);
        msg.reply("there was an error trying to execute that command!");
    }
});
exports.default = bot;
//# sourceMappingURL=discordBot.js.map