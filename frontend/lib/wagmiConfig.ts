"use client";

import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";

const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "";

if (!rpcUrl) {
  console.warn("NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL is not set");
}

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(rpcUrl || undefined)
  }
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}