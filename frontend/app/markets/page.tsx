import { fetchActiveMarkets } from "../../lib/polymarket";
import { MarketCard } from "../../components/MarketCard";

export const revalidate = 60; // SSR with 1-minute cache

export default async function MarketsPage() {
  const markets = await fetchActiveMarkets(5);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Polymarket Markets</h1>
      <p className="text-sm text-slate-300">
        These are live markets from Polymarket Gamma API. Use the{" "}
        <span className="font-mono text-xs">conditionId</span> when making
        forecasts in a league.
      </p>
      <div className="grid gap-3">
        {markets.map((m) => (
          <MarketCard key={m.conditionId} market={m} />
        ))}
        {markets.length === 0 && (
          <div className="text-xs text-slate-400">
            No open markets returned from Polymarket right now. Try again
            shortly or adjust filters in scripts.
          </div>
        )}
      </div>
    </div>
  );
}
