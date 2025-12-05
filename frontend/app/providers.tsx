"use client";

import React from "react";
import "@coinbase/onchainkit/styles.css";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { wagmiConfig } from "../lib/wagmiConfig";

const apiKey =
  process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? "demo-api-key";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <OnchainKitProvider
        apiKey={apiKey}
        chain={baseSepolia}
        config={{
          appearance: {
            mode: "dark",
          },
          wallet: {
            display: "modal",
            termsUrl: "https://www.example.com/terms",
            privacyUrl: "https://www.example.com/privacy",
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
