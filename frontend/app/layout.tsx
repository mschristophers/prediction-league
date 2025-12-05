import "./globals.css";
import type { Metadata } from "next";
import { Web3Providers } from "../lib/wagmiClient";
import { NavBar } from "../components/NavBar";

export const metadata: Metadata = {
  title: "Prediction League",
  description:
    "A Base Sepolia dApp that turns Polymarket markets into a forecasting league for groups."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Web3Providers>
          <NavBar />
          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </Web3Providers>
      </body>
    </html>
  );
}
