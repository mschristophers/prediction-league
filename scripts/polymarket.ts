import axios from "axios";

const GAMMA_BASE_URL =
  process.env.POLYMARKET_GAMMA_URL ?? "https://gamma-api.polymarket.com";

export interface GammaMarket {
    id: string;
    question: string;
    conditionId: string;
    slug: string;
    endDateIso?: string;
    outcomes?: string;        // often '["Yes","No"]' or comma-separated
    outcomePrices?: string;   // often '["0.37","0.63"]' or comma-separated
    volumeNum?: number;
    active: boolean;
    closed: boolean;
    umaResolutionStatus?: string;
}

/**
 * Parse outcomes string into an array of outcome labels.
 */
export function parseOutcomes(raw?: string): string[] {
    if (!raw) return [];
    const s = raw.trim();
    try {
        if (s.startsWith("[")) {
        const parsed = JSON.parse(s) as unknown[];
        return parsed.map((v) => String(v));
        }
        return s.split(",").map((x) => x.trim()).filter(Boolean);
    } catch {
        return s.split(",").map((x) => x.trim()).filter(Boolean);
    }
}

/**
 * Parse outcomePrices string into an array of numbers.
 */
export function parseOutcomePrices(raw?: string): number[] {
    if (!raw) return [];
    const s = raw.trim();
    try {
        if (s.startsWith("[")) {
        const parsed = JSON.parse(s) as unknown[];
        return parsed
            .map((v) => (typeof v === "string" ? Number(v) : Number(v)))
            .filter((n) => Number.isFinite(n));
        }
        return s
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isFinite(n));
    } catch {
        return [];
    }
}

/**
 * Fetch a list of markets (usually active, non-archived) from Gamma.
 */
export async function fetchActiveMarkets(limit = 30): Promise<GammaMarket[]> {
    const url = new URL("/markets", GAMMA_BASE_URL);
    url.searchParams.set("active", "true");
    url.searchParams.set("closed", "false");
    url.searchParams.set("limit", String(limit));

    const res = await axios.get<GammaMarket[]>(url.toString());
    return res.data;
}

/**
 * Fetch many markets (active + closed) and find by conditionId.
 */
export async function fetchMarketByConditionId(
    conditionId: string,
    max = 1000
): Promise<GammaMarket | undefined> {
    const url = new URL("/markets", GAMMA_BASE_URL);
    url.searchParams.set("limit", String(max));

    const res = await axios.get<GammaMarket[]>(url.toString());
    const markets = res.data;

    return markets.find((m) => m.conditionId === conditionId);
}
