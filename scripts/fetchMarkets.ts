import "dotenv/config";
import {
    fetchActiveMarkets,
    fetchClosedMarkets,
    parseOutcomes,
    parseOutcomePrices,
    DateRangeFilters,
} from "./polymarket";

async function main() {
    const statusEnv = (process.env.MARKET_STATUS ?? "open").toLowerCase();
    const status: "open" | "closed" =
        statusEnv === "closed" ? "closed" : "open";

    const limit =
        process.env.MARKET_LIMIT != null
        ? Number(process.env.MARKET_LIMIT)
        : 5;

    const dateFilters: DateRangeFilters = {};
    if (process.env.GAMMA_START_DATE_MIN) {
        dateFilters.startDateMin = process.env.GAMMA_START_DATE_MIN;
    }
    if (process.env.GAMMA_START_DATE_MAX) {
        dateFilters.startDateMax = process.env.GAMMA_START_DATE_MAX;
    }
    if (process.env.GAMMA_END_DATE_MIN) {
        dateFilters.endDateMin = process.env.GAMMA_END_DATE_MIN;
    }
    if (process.env.GAMMA_END_DATE_MAX) {
        dateFilters.endDateMax = process.env.GAMMA_END_DATE_MAX;
    }

    const fetchFn =
        status === "open" ? fetchActiveMarkets : fetchClosedMarkets;

    console.log(
        `Fetching ${status.toUpperCase()} markets from Gamma (limit=${limit})...`
    );
    if (Object.keys(dateFilters).length > 0) {
        console.log("Date filters:", dateFilters);
    }

    const markets = await fetchFn(limit, dateFilters);

    console.log(
        `Found ${markets.length} markets (showing up to ${limit}):\n`
    );

    markets.slice(0, limit).forEach((m, idx) => {
        const outcomes = parseOutcomes(m);
        const prices = parseOutcomePrices(m);

        const yesPrice = prices[0];
        const impliedYesPct =
        typeof yesPrice === "number"
            ? (yesPrice * 100).toFixed(1)
            : "n/a";

        console.log("––––––––––––––––––––––––");
        console.log(`[#${idx + 1}] Question:      ${m.question}`);
        console.log(`ConditionId:   ${m.conditionId}`);
        console.log(`Slug:          ${m.slug}`);
        console.log(`Start date:    ${m.startDate}`);
        console.log(`End date:      ${m.endDate}`);
        console.log(`Closed:        ${m.closed ?? "unknown"}`);
        console.log(
        `Outcomes:      ${
            outcomes.length ? outcomes.join(" | ") : "n/a"
        }`
        );
        console.log(
        `OutcomePrices: ${
            prices.length ? prices.join(" , ") : "n/a"
        }`
        );
        console.log(
        `Implied YES %: ${
            impliedYesPct !== "n/a" ? `${impliedYesPct}%` : "n/a"
        }`
        );
        console.log();
    });

    console.log(
        "Use one of the ConditionIds above as MARKET_CONDITION_ID in your .env for the league."
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
