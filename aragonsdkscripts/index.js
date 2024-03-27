"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.context = void 0;
var ethers_1 = require("ethers");
var sdk_client_1 = require("@aragon/sdk-client");
//import { SupportedNetwork } from "@aragon/sdk-client-common";
var contextParams = {
    //network: "mainnet",
    network: "sepolia",
    //web3Providers: "https://rpc.ankr.com/eth", // https://rpc.ankr.com/eth_sepolia
    signer: ethers_1.Wallet.createRandom(),
    // Optional, but without it the client will not be able to resolve IPFS content
    ipfsNodes: [
        {
            url: "https://testing-ipfs-0.aragon.network/api/v0",
            headers: { "X-API-KEY": "b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt" },
        },
    ],
};
exports.context = new sdk_client_1.Context(contextParams);
exports.client = new sdk_client_1.Client(exports.context);
