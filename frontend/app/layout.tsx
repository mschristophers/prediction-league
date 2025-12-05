import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navigation } from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prediction League - Forecast & Compete",
  description:
    "Create prediction leagues, forecast outcomes on Polymarket markets, and compete with friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-slate-950 text-slate-50"}>
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
