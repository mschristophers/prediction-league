import { DEMO_END_DATE_MAX, DEMO_END_DATE_MIN, fetchClosedMarkets } from "../../lib/polymarket";
import { MarketsClient } from "../../components/MarketsClient";

export const revalidate = 60;

export default async function MarketsPage() {
  const markets = await fetchClosedMarkets(10, {
    endDateMin: DEMO_END_DATE_MIN,
    endDateMax: DEMO_END_DATE_MAX,
  });
  return <MarketsClient initialMarkets={markets} />;
}
