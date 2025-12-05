"use client";

import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { chain } from "./chains";

const queryClient = new QueryClient();

const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "";
if (!rpcUrl) {
  console.warn("NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL is not set");
}

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(rpcUrl)
  }
});

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

