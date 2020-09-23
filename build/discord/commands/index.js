"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ping_1 = __importDefault(require("./ping"));
var unsubscribe_1 = __importDefault(require("./unsubscribe"));
var subscribe_1 = __importDefault(require("./subscribe"));
var getSubscriptions_1 = __importDefault(require("./getSubscriptions"));
var commands = {
    Ping: ping_1.default,
    Subscribe: unsubscribe_1.default,
    UnsubscribeCommand: subscribe_1.default,
    GetSubscriptionsCommand: getSubscriptions_1.default,
};
exports.default = commands;
//# sourceMappingURL=index.js.map