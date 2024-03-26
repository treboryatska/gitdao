import { Wallet } from "ethers";
import { Client, Context, ContextParams } from "@aragon/sdk-client";
//import { SupportedNetwork } from "@aragon/sdk-client-common";

  const contextParams: ContextParams = {
    //network: "mainnet",
    network: "sepolia",   
    //web3Providers: "https://rpc.ankr.com/eth", // https://rpc.ankr.com/eth_sepolia
    signer: Wallet.createRandom(),
    // Optional, but without it the client will not be able to resolve IPFS content
    ipfsNodes: [
      {
        url: "https://testing-ipfs-0.aragon.network/api/v0",
        headers: { "X-API-KEY": "b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt" },
      },
    ],
  };

 export const context: Context = new Context(contextParams);
 export const client: Client = new Client(context);

