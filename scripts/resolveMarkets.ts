import "dotenv/config";
import { ethers } from "hardhat";
import {
    fetchMarketByConditionId,
    parseOutcomes,
    parseOutcomePrices,
} from "./polymarket";
import {
    brierPenaltyScaled,
    scoreDeltaFromForecast,
    outcomeToBinary,
} from "./utils/scoring";

async function main() {
    const contractAddress = process.env.PREDICTION_LEAGUE_ADDRESS;
    const leagueIdEnv = process.env.LEAGUE_ID;
    const marketConditionId = process.env.MARKET_CONDITION_ID;
    const winningOutcomeEnv = (process.env.WINNING_OUTCOME ?? "").toLowerCase();
    const participantsEnv = process.env.PARTICIPANTS ?? "";

    if (!contractAddress) throw new Error("PREDICTION_LEAGUE_ADDRESS not set");
    if (!leagueIdEnv) throw new Error("LEAGUE_ID not set");
    if (!marketConditionId) throw new Error("MARKET_CONDITION_ID not set");
    if (winningOutcomeEnv !== "yes" && winningOutcomeEnv !== "no") {
        throw new Error('WINNING_OUTCOME must be "yes" or "no"');
    }

    const leagueId = BigInt(leagueIdEnv);
    const participants = participantsEnv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (participants.length === 0) {
        throw new Error("PARTICIPANTS must contain at least one address");
    }

    console.log("League ID:          ", leagueId.toString());
    console.log("Contract address:   ", contractAddress);
    console.log("ConditionId:        ", marketConditionId);
    console.log("Winning outcome:    ", winningOutcomeEnv.toUpperCase());
    console.log("Participants:       ", participants);
    console.log("");

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt(
        "PredictionLeague",
        contractAddress,
        signer
    );

    // 1) Fetch market info from Gamma for context
    const market = await fetchMarketByConditionId(marketConditionId);
    if (!market) {
        console.warn("⚠️  Market not found in Gamma for that conditionId.");
    } else {
        const outcomes = parseOutcomes(market);
        const prices = parseOutcomePrices(market);

        console.log("Polymarket market info:");
        console.log(`  Question:      ${market.question}`);
        console.log(`  Slug:          ${market.slug}`);
        console.log(`  Closed:        ${market.closed ?? "unknown"}`);
        console.log(`  UMA status:    ${market.umaResolutionStatus ?? "n/a"}`);
        console.log(
        `  Outcomes:      ${
            outcomes.length ? outcomes.join(" | ") : "n/a"
        }`
        );
        console.log(
        `  OutcomePrices: ${
            prices.length ? prices.join(" , ") : "n/a"
        }`
        );
        console.log("");
    }

    // 2) Set market outcome on-chain (if not already resolved)
    const marketIdBytes32 = marketConditionId as `0x${string}`;
    const onchainOutcome = await contract.marketOutcomes(marketIdBytes32);

    if (onchainOutcome.resolved) {
        console.log(
            "⚠️  Market already resolved on-chain, skipping setMarketOutcome."
        );
    } else {
        const outcomeBool = winningOutcomeEnv === "yes";
        console.log("Setting market outcome on-chain...");
        const tx = await contract.setMarketOutcome(
            marketIdBytes32,
            outcomeBool
        );
        await tx.wait();
        console.log("✅ Market outcome set.");
    }

    console.log("\nUpdating scores based on Brier penalty...\n");

    // 3) For each participant: read prediction → compute delta → updateScore
    for (const addr of participants) {
        const [exists, forecast, timestamp] = await contract.getPrediction(
            leagueId,
            marketIdBytes32,
            addr
        );

        if (!exists) {
            console.log(
                `- ${addr}: no prediction found for this market in league ${leagueId}`
            );
            continue;
        }

        const forecastPct = Number(forecast); // 0-100
        const outcomeBool = winningOutcomeEnv === "yes";
        const binaryOutcome = outcomeToBinary(outcomeBool);
        const penalty = brierPenaltyScaled(forecastPct, binaryOutcome);
        const delta = scoreDeltaFromForecast(forecastPct, binaryOutcome);

        const currentScore = await contract.getScore(leagueId, addr);

        console.log(
            `- ${addr}: forecast=${forecastPct}% at ts=${timestamp.toString()}, ` +
            `penalty=${penalty}, delta=${delta}, currentScore=${currentScore}`
        );

        const tx = await contract.updateScore(leagueId, addr, delta);
        await tx.wait();

        const newScore = await contract.getScore(leagueId, addr);
        console.log(`  -> newScore=${newScore}\n`);
    }

    console.log("✅ Scores updated for all participants.");
    console.log(
        "⚠️ Note: this script is NOT idempotent – running it again for the same market will apply the score deltas again."
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});