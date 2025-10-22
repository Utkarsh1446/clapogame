import { http, createConfig } from "wagmi";
import { localhost } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";
import { defineChain } from "viem";

// Define Monad Testnet
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [monadTestnet, localhost],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Clapo Game",
        url: typeof window !== "undefined" ? window.location.origin : "",
      },
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [localhost.id]: http(),
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
});
