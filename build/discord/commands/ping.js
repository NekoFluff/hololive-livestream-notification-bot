"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PingCommand = {
    name: "ping",
    description: "Ping!",
    execute: function (msg, _args) {
        msg.reply("pong");
        // msg.channel.send("pong");
    },
};
exports.default = PingCommand;
//# sourceMappingURL=ping.js.map