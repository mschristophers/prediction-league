const GAMMA_BASE_URL =
  process.env.POLYMARKET_GAMMA_URL ?? "https://gamma-api.polymarket.com";

export interface GammaMarket {
  id: string;
  question: string | null;
  conditionId: string;
  slug: string | null;
  endDate: string | null;
  startDate: string | null;
  closed?: boolean | null;
  outcomes?: string | null; // e.g. "Yes|No" or "Yes,No"
  outcomePrices?: string | null; // e.g. "0.123,0.877"
  umaResolutionStatus?: string | null;
}

export type DateRangeFilters = {
  startDateMin?: Date | string;
  startDateMax?: Date | string;
  endDateMin?: Date | string;
  endDateMax?: Date | string;
};

type MarketStatus = "open" | "closed" | "all";

interface FetchMarketsOptions extends DateRangeFilters {
  status?: MarketStatus;
  limit?: number;
  offset?: number;
}

function toIsoString(value?: Date | string): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value;
}

async function fetchMarkets(
  options: FetchMarketsOptions = {}
): Promise<GammaMarket[]> {
  const {
    status = "open",
    limit = 20,
    offset = 0,
    startDateMin,
    startDateMax,
    endDateMin,
    endDateMax,
  } = options;

  const url = new URL("/markets", GAMMA_BASE_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));

  if (status === "open") {
    url.searchParams.set("closed", "false");
  } else if (status === "closed") {
    url.searchParams.set("closed", "true");
  }

  const sdMin = toIsoString(startDateMin);
  if (sdMin) url.searchParams.set("start_date_min", sdMin);

  const sdMax = toIsoString(startDateMax);
  if (sdMax) url.searchParams.set("start_date_max", sdMax);

  const edMin = toIsoString(endDateMin);
  if (edMin) url.searchParams.set("end_date_min", edMin);

  const edMax = toIsoString(endDateMax);
  if (edMax) url.searchParams.set("end_date_max", edMax);

  const res = await fetch(url.toString(), {
    next: { revalidate: status === "open" ? 60 : 3600 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gamma /markets ${res.status}: ${text}`);
  }

  const json = (await res.json()) as GammaMarket[];
  return json;
}

export function fetchActiveMarkets(
  limit = 20,
  dateFilters: DateRangeFilters = {}
): Promise<GammaMarket[]> {
  return fetchMarkets({ status: "open", limit, ...dateFilters });
}

export function fetchClosedMarkets(
  limit = 20,
  dateFilters: DateRangeFilters = {}
): Promise<GammaMarket[]> {
  return fetchMarkets({ status: "closed", limit, ...dateFilters });
}

export async function fetchMarketByConditionId(
  conditionId: string
): Promise<GammaMarket | null> {
  if (!conditionId) return null;

  const url = new URL("/markets", GAMMA_BASE_URL);
  url.searchParams.set("limit", "1");
  url.searchParams.set("condition_ids", conditionId);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gamma /markets by condition_ids ${res.status}: ${text}`);
  }

  const json = (await res.json()) as GammaMarket[];
  return json[0] ?? null;
}

export function parseOutcomes(market: GammaMarket): string[] {
  if (!market.outcomes) return [];
  const raw = market.outcomes;
  const sep = raw.includes("|") ? "|" : ",";
  return raw
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseOutcomePrices(market: GammaMarket): number[] {
  if (!market.outcomePrices) return [];
  return market.outcomePrices
    .split(",")
    .map((s) => parseFloat(s.trim()))
    .filter((n) => Number.isFinite(n));
}
