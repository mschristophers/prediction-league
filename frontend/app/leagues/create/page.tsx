"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract
} from "wagmi";
import { predictionLeagueConfig } from "../../../lib/contract";

export default function CreateLeaguePage() {
  const [name, setName] = useState("");
  const [createdId, setCreatedId] = useState<bigint | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const { data: nextLeagueId } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "nextLeagueId",
    query: { enabled: isSuccess } // only refetch after tx
  });

  const disabled = isPending || confirming || !name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      ...predictionLeagueConfig,
      functionName: "createLeague",
      args: [name]
    });
  };

  // When tx confirmed, infer new leagueId as nextLeagueId - 1
  if (isSuccess && nextLeagueId && !createdId) {
    const id = (nextLeagueId as bigint) - 1n;
    setCreatedId(id);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Create a League</h1>
      <form onSubmit={handleSubmit} className="card space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1">League name</label>
          <input
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            placeholder="e.g. Michigan Blockchain Forecast League"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full py-2 rounded bg-emerald-500 text-slate-900 font-semibold disabled:opacity-60"
        >
          {isPending || confirming ? "Creating..." : "Create league"}
        </button>
      </form>

      {createdId && (
        <div className="card text-sm text-slate-200 space-y-1 max-w-md">
          <div>✅ League created on Base Sepolia.</div>
          <div>
            League ID:{" "}
            <span className="font-mono text-emerald-400">
              {createdId.toString()}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Share this ID with your group, then go to{" "}
            <span className="font-mono">/leagues/{createdId.toString()}</span>{" "}
            to start forecasting.
          </div>
        </div>
      )}
    </div>
  );
}
