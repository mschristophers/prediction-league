"use client";

import Link from "next/link";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";

export function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg">Prediction League</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-300">
            <Link href="/leagues" className="hover:text-white">
              Leagues
            </Link>
            <Link href="/leagues/create" className="hover:text-white">
              Create league
            </Link>
            <Link href="/markets" className="hover:text-white">
              Markets
            </Link>
          </nav>
        </div>

        <Wallet>
          <ConnectWallet />
          <WalletDropdown>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </header>
  );
}
