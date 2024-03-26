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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_client_1 = require("@aragon/sdk-client");
var index_1 = require("../index");
// Instantiate the general purpose client from the Aragon OSx SDK context.
var client = new sdk_client_1.Client(index_1.context);
// Address or ENS of the DAO whose metadata you want to retrieve.
//const daoAddressOrEns: string = "0xc432356f9f2da794dda3df10706ea34dc18a725d"; // ea.dao.eth
var daoAddressOrEns = "0x0d870e2ea982298d7756ac6aefe90271dabb80b5"; // gitdao testnet
function getDaoDetails() {
    return __awaiter(this, void 0, void 0, function () {
        var dao;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.methods.getDao(daoAddressOrEns)];
                case 1:
                    dao = _a.sent();
                    console.log(dao);
                    return [2 /*return*/];
            }
        });
    });
}
// This function retrieves the address of a plugin installed in a DAO.
function getPluginAddress() {
    return __awaiter(this, void 0, void 0, function () {
        var dao, pluginId, plugin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.methods.getDao(daoAddressOrEns)];
                case 1:
                    dao = _a.sent();
                    pluginId = 'token-voting.plugin.dao.eth';
                    plugin = dao === null || dao === void 0 ? void 0 : dao.plugins.find(function (plugin) { return plugin.id === pluginId; });
                    if (plugin) {
                        //console.log("Plugin address is: "+plugin.instanceAddress); // For debugging
                        return [2 /*return*/, plugin.instanceAddress];
                    }
                    else {
                        console.log('Plugin not found.');
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getDaoBalances() {
    return __awaiter(this, void 0, void 0, function () {
        var daoBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.methods.getDaoBalances({ daoAddressOrEns: daoAddressOrEns })];
                case 1:
                    daoBalances = _a.sent();
                    console.log(daoBalances);
                    return [2 /*return*/];
            }
        });
    });
}
function getMembers() {
    return __awaiter(this, void 0, void 0, function () {
        var tokenVotingClient, pluginAddress, members;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenVotingClient = new sdk_client_1.TokenVotingClient(index_1.context);
                    return [4 /*yield*/, getPluginAddress()];
                case 1:
                    pluginAddress = _a.sent();
                    return [4 /*yield*/, tokenVotingClient.methods.getMembers({ pluginAddress: pluginAddress })];
                case 2:
                    members = _a.sent();
                    console.log(members);
                    return [2 /*return*/];
            }
        });
    });
}
//getDaoDetails();
//getDaoBalances();
getMembers();
//getPluginAddress();
