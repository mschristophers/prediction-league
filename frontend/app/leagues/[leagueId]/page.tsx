"use client";

import { useParams, useRouter } from "next/navigation";
import { useConnection, useReadContract } from "wagmi";
import { predictionLeagueConfig } from "../../../lib/contract";
import { LeagueCard } from "../../../components/LeagueCard";
import { useState } from "react";

export default function LeagueDetailPage() {
  const params = useParams<{ leagueId: string }>();
  const leagueId = BigInt(params.leagueId);
  const router = useRouter();
  const { address } = useConnection();

  const { data: league } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "leagues",
    args: [leagueId]
  });

  const { data: score } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "getScore",
    args: [leagueId, address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: Boolean(address) }
  });

  const [conditionId, setConditionId] = useState("");

  if (!league) {
    return <div className="text-sm">Loading league…</div>;
  }

  const [id, name, creator, exists] = league as [
    bigint,
    string,
    string,
    boolean
  ];

  if (!exists) {
    return <div className="text-sm">League not found.</div>;
  }

  return (
    <div className="space-y-4">
      <LeagueCard id={id} name={name} creator={creator} />

      <div className="card text-sm space-y-2">
        <div className="font-semibold">Your score</div>
        {address ? (
          <div>
            Current score:{" "}
            <span className="font-mono">
              {score !== undefined ? score.toString() : "0"}
            </span>
          </div>
        ) : (
          <div className="text-slate-400">
            Connect wallet to see your score in this league.
          </div>
        )}
        <div className="text-xs text-slate-400">
          Scores are updated when markets resolve via an off-chain script that
          computes Brier penalties and calls <span className="font-mono">updateScore</span>.
        </div>
      </div>

      <div className="card space-y-3">
        <div className="font-semibold text-sm">
          Make a forecast for this league
        </div>
        <p className="text-xs text-slate-400">
          Step 1: Go to the{" "}
          <a href="/markets" className="underline">
            Markets
          </a>{" "}
          page, pick a Polymarket market and copy its{" "}
          <span className="font-mono">conditionId</span>.
        </p>
        <p className="text-xs text-slate-400">
          Step 2: Paste it below and continue to the forecast page.
        </p>

        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!conditionId) return;
            router.push(
              `/leagues/${leagueId.toString()}/predict?conditionId=${conditionId}`
            );
          }}
        >
          <input
            className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono"
            placeholder="0x9b946f54f3428aafc308c33aa04a943fe13a011bdac9a9b66e1ba16c416ca256"
            value={conditionId}
            onChange={(e) => setConditionId(e.target.value.trim())}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-500 text-slate-900 text-sm font-semibold"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
