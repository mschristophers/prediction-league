"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span>Prediction League</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/" className="hover:text-emerald-400">
              Home
            </Link>
            <Link href="/markets" className="hover:text-emerald-400">
              Markets
            </Link>
            <Link href="/leagues" className="hover:text-emerald-400">
              My Leagues
            </Link>
            <Link href="/leagues/create" className="hover:text-emerald-400">
              Create League
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

