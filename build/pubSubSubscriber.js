"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var pubsubhubbub_1 = __importDefault(require("pubsubhubbub"));
var options = {
    callbackUrl: process.env.PUBSUBHUBBUB_CALLBACK || "",
};
var pubSubSubscriber = pubsubhubbub_1.default.createServer(options);
console.log("pubSubSubscriber options", options);
// console.log("pubSubSubscriber", pubSubSubscriber);
var transmitDeveloperNotification_1 = __importDefault(require("./discord/transmitDeveloperNotification"));
var transmitDeveloperNotification_2 = __importDefault(require("./discord/transmitDeveloperNotification"));
pubSubSubscriber.on("subscribe", function (data) {
    console.log("-------------------SUBSCRIBE-------------------");
    console.log(data.topic + " subscribed");
    // console.log(data.hub + " hub");
    // console.log(data.callback + " callback");
    transmitDeveloperNotification_2.default("Subscribed to " + data.topic);
});
pubSubSubscriber.on("unsubscribe", function (data) {
    console.log("-------------------UNSUBSCRIBE-------------------");
    console.log(data.topic + " unsubscribed");
    // console.log(data.hub + " hub");
    // console.log(data.callback + " callback");
    transmitDeveloperNotification_2.default("Unsubscribed to " + data.topic);
});
pubSubSubscriber.on("feed", function (data) {
    console.log("-------------------FEED-------------------");
    transmitDeveloperNotification_2.default("Feed incomming!");
    transmitDeveloperNotification_2.default(data.feed);
    console.log(data.topic + " feed");
    // console.log(data.hub + " hub");
    // console.log(data.callback + " callback");
    console.log(data.feed);
    transmitDeveloperNotification_1.default(data.feed);
    // console.log(data.feaders + " headers");
});
exports.default = pubSubSubscriber;
//# sourceMappingURL=pubSubSubscriber.js.map