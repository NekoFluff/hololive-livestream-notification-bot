"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var pubSubSubscriber_1 = __importDefault(require("./pubSubSubscriber"));
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var helmet_1 = __importDefault(require("helmet"));
var body_parser_1 = __importDefault(require("body-parser"));
// Middleware
var corsOptions = {
    exposedHeaders: "X-Auth-Token",
};
app.use(morgan_1.default("dev"));
app.use(cors_1.default(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use(helmet_1.default());
// Api routes below
app.get("/", function (_req, res, _next) {
    res.send("Um. You weren't suppose to find this");
});
app.use("/pubsubhubbub", pubSubSubscriber_1.default.listener());
exports.default = app;
//# sourceMappingURL=server.js.map