"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Hex } from "viem";
import { predictionLeagueConfig } from "../lib/contract";

interface Props {
  leagueId: bigint;
  conditionId: string; // 0x... from Polymarket
}

export function PredictionForm({ leagueId, conditionId }: Props) {
  const [forecast, setForecast] = useState(60);
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const disabled = isPending || confirming;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!conditionId || !conditionId.startsWith("0x")) {
      setError("Invalid conditionId");
      return;
    }

    try {
      const marketId = conditionId as Hex;
      writeContract({
        ...predictionLeagueConfig,
        functionName: "submitPrediction",
        args: [leagueId, marketId, forecast]
      });
    } catch (err) {
      console.error(err);
      setError("Failed to send transaction");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 mt-4">
      <div className="text-sm text-slate-400">
        Forecast for market:
        <div className="font-mono text-xs break-all">{conditionId}</div>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Your forecast (YES probability)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={forecast}
          onChange={(e) => setForecast(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-1">
          <span className="font-semibold">{forecast}%</span> chance of YES
        </div>
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-2 rounded bg-emerald-500 text-slate-900 font-semibold disabled:opacity-60"
      >
        {isPending || confirming
          ? "Submitting..."
          : isSuccess
          ? "Submitted!"
          : "Submit forecast"}
      </button>
    </form>
  );
}
