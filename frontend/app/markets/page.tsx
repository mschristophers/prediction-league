import { fetchActiveMarkets } from "../../lib/polymarket";
import { MarketsClient } from "../../components/MarketsClient";

export const revalidate = 60;

export default async function MarketsPage() {
  const markets = await fetchActiveMarkets(10);
  return <MarketsClient initialMarkets={markets} />;
}
