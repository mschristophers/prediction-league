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
          <ConnectWallet className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed" />
          <WalletDropdown>
            <WalletDropdownDisconnect className="w-full justify-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-200 hover:bg-slate-800 hover:border-red-500/50 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950" />
          </WalletDropdown>
        </Wallet>
      </div>
    </header>
  );
}
