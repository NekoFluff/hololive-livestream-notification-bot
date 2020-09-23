"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discordBot_1 = __importDefault(require("../discord/discordBot"));
function transmitDeveloperNotification(message) {
    // console.log(discordBot.users);
    var user = discordBot_1.default.users.cache.get("142090800279453696");
    if (user)
        user.send(message);
}
exports.default = transmitDeveloperNotification;
//# sourceMappingURL=transmitDeveloperNotification.js.map