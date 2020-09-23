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
Object.defineProperty(exports, "__esModule", { value: true });
var subscriptions;
var subscriptionsDAO = /** @class */ (function () {
    function subscriptionsDAO() {
    }
    subscriptionsDAO.injectDB = function (conn) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (subscriptions)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, conn
                                .db(process.env.DATABASE_NAMESPACE)
                                .collection("subscriptions")];
                    case 2:
                        subscriptions = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error("Unable to establish collection handles in subscriptionsDAO: " + e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds the market price stored in the 'marketPrice' collection
     */
    subscriptionsDAO.getSubscriptions = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pipeline = [
                            { $match: { user: user } },
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, subscriptions.aggregate(pipeline).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_2 = _a.sent();
                        console.error("Unable to run aggregation, " + e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    subscriptionsDAO.addSubscriptions = function (user, newSubs) {
        return __awaiter(this, void 0, void 0, function () {
            var _datum, newSubs_1, newSubs_1_1, sub, _data, result, e_3;
            var e_4, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (user == null)
                            return [2 /*return*/, null];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _datum = [];
                        try {
                            for (newSubs_1 = __values(newSubs), newSubs_1_1 = newSubs_1.next(); !newSubs_1_1.done; newSubs_1_1 = newSubs_1.next()) {
                                sub = newSubs_1_1.value;
                                _data = {
                                    user: user,
                                    subscription: sub,
                                };
                                _datum.push(_data);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (newSubs_1_1 && !newSubs_1_1.done && (_a = newSubs_1.return)) _a.call(newSubs_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        return [4 /*yield*/, subscriptions.insertMany(_datum, { ordered: false })];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, result];
                    case 3:
                        e_3 = _b.sent();
                        console.error(e_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    subscriptionsDAO.removeSubscriptions = function (user, subs) {
        return __awaiter(this, void 0, void 0, function () {
            var operations, subs_1, subs_1_1, sub, result;
            var e_5, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (user == null)
                            return [2 /*return*/];
                        operations = [];
                        try {
                            for (subs_1 = __values(subs), subs_1_1 = subs_1.next(); !subs_1_1.done; subs_1_1 = subs_1.next()) {
                                sub = subs_1_1.value;
                                operations.push({
                                    deleteOne: { filter: { user: user, subscription: sub } },
                                });
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (subs_1_1 && !subs_1_1.done && (_a = subs_1.return)) _a.call(subs_1);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        return [4 /*yield*/, subscriptions.bulkWrite(operations, {
                                ordered: false,
                            })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return subscriptionsDAO;
}());
exports.default = subscriptionsDAO;
//# sourceMappingURL=subscriptionDAO.js.map