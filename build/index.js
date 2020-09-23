"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var mongodb_1 = require("mongodb");
var subscriptionDAO_1 = __importDefault(require("./dao/subscriptionDAO"));
var pubSubSubscriber_1 = __importDefault(require("./pubSubSubscriber"));
var server_1 = __importDefault(require("./server"));
dotenv_1.default.config();
var port = process.env.PORT || 3000;
mongodb_1.MongoClient.connect(process.env.DATABASE_URI ||
    "Invalid DB URI. Please add DATABASE_URI to .env file", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 50,
    wtimeout: 2500,
}
// Catch any errors with starting the server
)
    .catch(function (e) {
    console.error(e.stack);
    process.exit(1);
    // On success, inject the client connection to every DAO (data access object)
})
    .then(function (clientConnection) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, subscriptionDAO_1.default.injectDB(clientConnection)];
            case 1:
                _a.sent();
                server_1.default.listen(port, function () {
                    console.log("Listening on port " + port);
                });
                return [2 /*return*/];
        }
    });
}); });
function subscribe() {
    var e_1, _a;
    // var topics = [
    //   "https://superfeedr-blog-feed.herokuapp.com/",
    //   "https://www.youtube.com/channel/UCyl1z3jo3XHR1riLFKG5UAg", // Watson
    //   "https://www.youtube.com/channel/UCMwGHR0BTZuLsmjY_NT5Pwg", // Ninomae
    //   "https://www.youtube.com/channel/UCL_qhgtOy0dy1Agp8vkySQg", // Mori
    //   "https://www.youtube.com/channel/UCHsx4Hqa-1ORjQTh9TYDhww", // Takanashi
    //   "https://www.youtube.com/channel/UCoSrY_IQQVpmIRZ9Xf-y93g", // Gawr Gura
    // ];
    // var hub = "http://pubsubhubbub.appspot.com/";
    var topics = ["http://push-pub.appspot.com/feed"];
    var hub = "https://pubsubhubbub.superfeedr.com";
    try {
        for (var topics_1 = __values(topics), topics_1_1 = topics_1.next(); !topics_1_1.done; topics_1_1 = topics_1.next()) {
            var topic = topics_1_1.value;
            pubSubSubscriber_1.default.subscribe(topic, hub, function (err) {
                if (err) {
                    console.log("Failed subscribing", err);
                }
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (topics_1_1 && !topics_1_1.done && (_a = topics_1.return)) _a.call(topics_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
subscribe();
var _reschedulerId = setInterval(function () {
    console.log("Re-subscribing...");
    subscribe();
}, 43100 * 1000);
//# sourceMappingURL=index.js.map