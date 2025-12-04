import "dotenv/config";
import { fetchActiveMarkets, parseOutcomes, parseOutcomePrices } from "./polymarket";

async function main() {
    const limit = Number(process.env.POLYMARKET_MARKETS_LIMIT ?? "20");
    const topicFilter = (process.env.POLYMARKET_TOPIC ?? "").toLowerCase();

    const markets = await fetchActiveMarkets(limit);

    const filtered = markets.filter((m) => {
        if (!topicFilter) return true;
        const q = (m.question ?? "").toLowerCase();
        return q.includes(topicFilter);
    });

    console.log(`Found ${filtered.length} active markets (showing up to ${limit}):\n`);

    for (const m of filtered) {
        const outcomes = parseOutcomes(m.outcomes);
        const prices = parseOutcomePrices(m.outcomePrices);
        const yesProb = prices.length > 0 ? prices[0] : undefined;

        console.log("––––––––––––––––––––––––");
        console.log(`Question:      ${m.question}`);
        console.log(`ConditionId:   ${m.conditionId}`);
        console.log(`Slug:          ${m.slug}`);
        if (m.endDateIso) {
        console.log(`End date:      ${m.endDateIso}`);
        }
        console.log(`Outcomes:      ${outcomes.join(" | ") || "(unknown)"}`);
        if (prices.length > 0) {
        console.log(`OutcomePrices: ${prices.map((p) => p.toFixed(3)).join(" , ")}`);
        if (yesProb !== undefined) {
            console.log(`Implied YES %: ${(yesProb * 100).toFixed(1)}% (assuming index 0 = YES)`);
        }
        }
        console.log("");
    }

    console.log(
        "Use one of the ConditionIds above as MARKET_CONDITION_ID in your .env for the league."
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
