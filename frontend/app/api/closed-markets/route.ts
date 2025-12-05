import { NextResponse } from "next/server";
import {
  DEMO_END_DATE_MAX,
  DEMO_END_DATE_MIN,
  fetchClosedMarkets,
} from "../../../lib/polymarket";

export async function GET() {
  try {
    const markets = await fetchClosedMarkets(10, {
      endDateMin: DEMO_END_DATE_MIN,
      endDateMax: DEMO_END_DATE_MAX,
    });
    return NextResponse.json({ markets });
  } catch (e) {
    console.error("API /api/closed-markets error", e);
    return NextResponse.json(
      { markets: [], error: "Failed to load markets from Polymarket" },
      { status: 500 }
    );
  }
}
