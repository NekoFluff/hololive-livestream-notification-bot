"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discordBot_1 = __importDefault(require("./discordBot"));
var discord_js_1 = require("discord.js");
var xml2js_1 = __importDefault(require("xml2js"));
var parser = new xml2js_1.default.Parser();
function transmitDiscordNotification(xml) {
    parser.parseString(xml, function (err, result) {
        var e_1, _a, e_2, _b;
        if (err) {
            console.error(err);
            return;
        }
        var feed = result["feed"];
        try {
            for (var _c = __values(feed.entry), _d = _c.next(); !_d.done; _d = _c.next()) {
                var entry = _d.value;
                var author = entry.author[0].name[0];
                var authorURL = entry.author[0].uri[0];
                var title = entry.title[0];
                var published = entry.published[0];
                var link = entry.link[0]["$"].href;
                try {
                    // const updated = entry.updated[0];
                    for (var _e = (e_2 = void 0, __values(discordBot_1.default.guilds.cache)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 2), _key = _g[0], guild = _g[1];
                        var channel = guild.channels.cache.find(function (ch) { return ch.name === "hololive-notifications"; });
                        if (channel && channel.type === "text") {
                            var embed = new discord_js_1.MessageEmbed()
                                .setTitle(title)
                                .setAuthor(author, undefined, authorURL)
                                .setURL(link)
                                .setDescription("Published " + published)
                                .setColor(0xff0000);
                            channel.send(embed);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.default = transmitDiscordNotification;
//# sourceMappingURL=transmitDiscordNotification.js.map