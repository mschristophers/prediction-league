const GAMMA_BASE_URL = process.env.POLYMARKET_GAMMA_URL ?? "https://gamma-api.polymarket.com";

export interface GammaMarket {
  id: number;
  question: string;
  slug: string;
  endDate: string;
  closed: boolean;
  conditionId: string;
  outcomePrices?: number[];
  outcomes?: string[];
}

interface GammaMarketsResponse {
  markets: GammaMarket[];
}

export async function fetchActiveMarkets(limit = 5): Promise<GammaMarket[]> {
  const url = new URL("/markets", GAMMA_BASE_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("closed", "false");

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 } // cache for 60s on server
  } as any);

  if (!res.ok) {
    console.error("Gamma API error", res.status, await res.text());
    throw new Error("Failed to fetch markets");
  }

  const data = (await res.json()) as GammaMarketsResponse;
  return data.markets ?? [];
}

export async function fetchClosedMarkets(limit = 5): Promise<GammaMarket[]> {
  const url = new URL("/markets", GAMMA_BASE_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("closed", "true");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }
  } as any);

  if (!res.ok) throw new Error("Failed to fetch closed markets");
  const data = (await res.json()) as GammaMarketsResponse;
  return data.markets ?? [];
}

export async function fetchMarketByConditionId(
  conditionId: string
): Promise<GammaMarket | null> {
  const url = new URL("/markets", GAMMA_BASE_URL);
  url.searchParams.set("conditionId", conditionId);

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error("Gamma by conditionId error", res.status);
    return null;
  }
  const data = (await res.json()) as GammaMarketsResponse;
  return data.markets?.[0] ?? null;
}
