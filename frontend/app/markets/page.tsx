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
      </div>
    </div>
  );
}
