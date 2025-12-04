export type BinaryOutcome = 0 | 1;

/**
 * Convert a boolean outcome to 0/1 representation.
 */
export function outcomeToBinary(outcome: boolean): BinaryOutcome {
    return outcome ? 1 : 0;
}

/**
 * Brier penalty for a single binary forecast.
 * forecastPercent in [0, 100], outcome in {0, 1}.
 * Returns a non-negative integer scaled by `scale` (default 1e4).
 *
 * Example:
 *  forecast 75% on YES, actual YES:
 *    error = (0.75 - 1)^2 = 0.0625 → 625 with scale=1e4
 */
export function brierPenaltyScaled(
    forecastPercent: number,
    outcome: BinaryOutcome,
    scale = 10_000
): number {
    if (forecastPercent < 0 || forecastPercent > 100) {
        throw new Error(`forecastPercent out of range: ${forecastPercent}`);
    }

    const p = forecastPercent / 100;
    const error = p - outcome;
    const squared = error * error;
    const penalty = Math.round(squared * scale);

    return penalty;
}

/**
 * Convenience helper: convert penalty into a score delta.
 * "more accurate" = less negative.
 */
export function scoreDeltaFromForecast(
    forecastPercent: number,
    outcome: BinaryOutcome,
    scale = 10_000
): bigint {
  const penalty = brierPenaltyScaled(forecastPercent, outcome, scale);
    // Negative because we store penalties; higher skill = less negative.
    return BigInt(-penalty);
}
