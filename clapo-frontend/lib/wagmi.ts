import { http, createConfig } from "wagmi";
import { localhost } from "wagmi/chains";
import { injected } from "wagmi/connectors";
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
  chains: [localhost, monadTestnet],
  connectors: [injected()],
  transports: {
    [localhost.id]: http(),
    [monadTestnet.id]: http(),
  },
});
