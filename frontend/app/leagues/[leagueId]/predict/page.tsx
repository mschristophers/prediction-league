"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { GammaMarket, fetchMarketByConditionId } from "../../../../lib/polymarket";
import { PredictionForm } from "../../../../components/PredictionForm";

export default function PredictPage() {
  const params = useParams<{ leagueId: string }>();
  const leagueId = BigInt(params.leagueId);
  const searchParams = useSearchParams();
  const initialConditionId = searchParams.get("conditionId") || "";

  const [conditionId, setConditionId] = useState(initialConditionId);
  const [market, setMarket] = useState<GammaMarket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMarket(id: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMarketByConditionId(id);
      setMarket(result);
      if (!result) setError("No market found for that conditionId.");
    } catch (e) {
      console.error(e);
      setError("Failed to fetch market from Polymarket.");
      setMarket(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialConditionId) {
      loadMarket(initialConditionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConditionId]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        League {leagueId.toString()} – Make a forecast
      </h1>

      <div className="card space-y-3">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!conditionId) return;
            loadMarket(conditionId);
          }}
        >
          <input
            className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono"
            placeholder="Paste conditionId (0x...)"
            value={conditionId}
            onChange={(e) => setConditionId(e.target.value.trim())}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-slate-800 text-slate-100 text-sm font-semibold"
          >
            Load market
          </button>
        </form>

        {loading && (
          <div className="text-xs text-slate-400">Loading Polymarket data…</div>
        )}
        {error && <div className="text-xs text-red-400">{error}</div>}

        {market && (
          <div className="space-y-1 text-sm">
            <div className="text-xs text-slate-400">{market.slug}</div>
            <div className="font-medium">{market.question}</div>
            <div className="text-xs text-slate-400">
              Ends: {new Date(market.endDate).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">
              ConditionId:{" "}
              <span className="font-mono break-all">{market.conditionId}</span>
            </div>
          </div>
        )}
      </div>

      {market && (
        <PredictionForm
          leagueId={leagueId}
          conditionId={market.conditionId}
        />
      )}
    </div>
  );
}
