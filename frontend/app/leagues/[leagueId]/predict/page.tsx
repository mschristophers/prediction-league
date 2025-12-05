import { fetchMarketByConditionId } from "../../../../lib/polymarket";
import { PredictionForm } from "../../../../components/PredictionForm";

interface PredictPageProps {
  params: { leagueId: string };
  searchParams: { conditionId?: string };
}

export default async function PredictPage({
  params,
  searchParams,
}: PredictPageProps) {
  const leagueId = BigInt(params.leagueId);
  const conditionId = searchParams.conditionId || "";

  const market = conditionId
    ? await fetchMarketByConditionId(conditionId)
    : null;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        League {leagueId.toString()} – Make a forecast
      </h1>

      <div className="card space-y-3">
        {conditionId && !market && (
          <div className="text-xs text-red-400">
            No market found for that conditionId from Polymarket.
          </div>
        )}

        {!conditionId && (
          <div className="text-xs text-slate-400">
            No conditionId provided. Go back to the league page and select a
            market first.
          </div>
        )}

        {market && (
          <div className="space-y-1 text-sm">
            <div className="text-xs text-slate-400">{market.slug}</div>
            <div className="font-medium">{market.question}</div>
            <div className="text-xs text-slate-400">
              {market.endDate
                ? `Ends: ${new Date(market.endDate).toLocaleString()}`
                : "End date not available"}
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
