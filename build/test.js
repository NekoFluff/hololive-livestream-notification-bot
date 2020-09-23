"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var transmitDiscordNotification_1 = __importDefault(require("./discord/transmitDiscordNotification"));
var fs_1 = __importDefault(require("fs"));
var discordBot_1 = __importDefault(require("./discord/discordBot"));
discordBot_1.default.on("ready", function () {
    fs_1.default.readFile(__dirname + "/foo.xml", function (err, data) {
        transmitDiscordNotification_1.default(data.toString());
    });
});
//# sourceMappingURL=test.js.map