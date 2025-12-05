import Link from "next/link";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Identity, Avatar, Name, Address } from "@coinbase/onchainkit/identity";

export function NavBar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand / title */}
        <Link href="/" className="text-lg font-semibold">
          Prediction League
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/leagues"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Leagues
          </Link>
          <Link
            href="/markets"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Markets
          </Link>

          {/* OnchainKit wallet */}
          <Wallet>
            {/* Connect button (shows when not connected) */}
            <ConnectWallet className="rounded-full border px-3 py-1 text-sm">
              Connect
            </ConnectWallet>

            {/* Dropdown (shows when connected) */}
            <WalletDropdown>
              <Identity className="flex items-center gap-2 px-3 py-2">
                <Avatar />
                <div className="flex flex-col">
                  <Name className="text-sm font-medium" />
                  <Address className="text-xs text-muted-foreground" />
                </div>
              </Identity>

              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
