"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { predictionLeagueConfig } from "../../../lib/contract";
import { LeagueCard } from "../../../components/LeagueCard";
import {
  fetchActiveMarkets,
  GammaMarket,
} from "../../../lib/polymarket";
import { MarketCard } from "../../../components/MarketCard";

export default function LeagueDetailPage() {
  const params = useParams<{ leagueId: string }>();
  const leagueId = BigInt(params.leagueId);
  const router = useRouter();
  const search = useSearchParams();
  const preselectedConditionId = search.get("conditionId") || "";

  const { address } = useAccount();

  const { data: league } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "leagues",
    args: [leagueId],
  });

  const { data: rawScore } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "getScore",
    args: [
      leagueId,
      address ?? "0x0000000000000000000000000000000000000000",
    ],
    query: { enabled: Boolean(address) },
  });

  const [conditionId, setConditionId] = useState(preselectedConditionId);
  const [markets, setMarkets] = useState<GammaMarket[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);

  useEffect(() => {
    setConditionId(preselectedConditionId);
  }, [preselectedConditionId]);

  useEffect(() => {
    async function load() {
      setLoadingMarkets(true);
      try {
        const data = await fetchActiveMarkets(4);
        setMarkets(data);
      } catch (e) {
        console.error("League markets load error", e);
        setMarkets([]);
      } finally {
        setLoadingMarkets(false);
      }
    }
    load();
  }, []);

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

  const score = (rawScore ?? 0n) as bigint;

  return (
    <div className="space-y-4">
      <LeagueCard id={id} name={name} creator={creator} />

      <div className="card text-sm space-y-2">
        <div className="font-semibold">Your league score</div>
        {address ? (
          <>
            <div>
              Address:{" "}
              <span className="font-mono text-xs">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
            </div>
            <div>
              Brier penalty total:{" "}
              <span className="font-mono">{score.toString()}</span>
            </div>
            <div className="text-xs text-slate-400">
              Lower (less negative) is better. An off-chain script computes
              penalties using the Brier score and calls{" "}
              <span className="font-mono">updateScore</span> after markets
              resolve.
            </div>
          </>
        ) : (
          <div className="text-slate-400">
            Connect your wallet to see your score in this league.
          </div>
        )}
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">This week&apos;s markets</span>
          <span className="text-xs text-slate-400">
            From Polymarket Gamma API
          </span>
        </div>
        {loadingMarkets && (
          <div className="text-xs text-slate-400">Loading markets…</div>
        )}
        {!loadingMarkets && markets.length === 0 && (
          <div className="text-xs text-slate-400">
            No open markets returned right now. Try again shortly.
          </div>
        )}
        <div className="grid gap-3">
          {markets.map((m) => (
            <MarketCard
              key={m.conditionId}
              market={m}
              footer={
                <button
                  type="button"
                  className="text-xs px-2 py-1 border border-slate-700 rounded hover:bg-slate-800"
                  onClick={() =>
                    router.push(
                      `/leagues/${leagueId.toString()}/predict?conditionId=${
                        m.conditionId
                      }`
                    )
                  }
                  disabled={!address}
                >
                  {address
                    ? "Make prediction in this league"
                    : "Connect wallet to forecast"}
                </button>
              }
            />
          ))}
        </div>
      </div>

      <div className="card space-y-3">
        <div className="font-semibold text-sm">
          Make a forecast for this league
        </div>
        <p className="text-xs text-slate-400">
          Or paste a Polymarket{" "}
          <span className="font-mono">conditionId</span> directly.
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
            placeholder="0x9b94...ca256"
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
