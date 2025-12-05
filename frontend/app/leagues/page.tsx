"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { predictionLeagueConfig } from "../../lib/contract";
import { LeagueCard } from "../../components/LeagueCard";

export default function LeaguesPage() {
  const { data: nextLeagueId, isLoading: loadingCount } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "nextLeagueId"
  });

  const leagueIds = useMemo(() => {
    if (!nextLeagueId || nextLeagueId <= 1n) return [];
    const lastId = Number(nextLeagueId - 1n);
    return Array.from({ length: lastId }, (_, i) => BigInt(i + 1));
  }, [nextLeagueId]);

  const { data: leagues, isLoading: loadingLeagues } = useReadContracts({
    contracts: leagueIds.map((id) => ({
      ...predictionLeagueConfig,
      functionName: "leagues" as const,
      args: [id] as const
    }))
  });

  const isLoading = loadingCount || loadingLeagues;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Leagues</h1>
      <p className="text-sm text-slate-300">
        Browse leagues created on the Prediction League contract.
      </p>

      {isLoading && <div className="text-sm">Loading leagues…</div>}

      {!isLoading && leagueIds.length === 0 && (
        <div className="card text-sm text-slate-300">
          No leagues yet.{" "}
          <a href="/leagues/create" className="underline">
            Create the first league
          </a>
          .
        </div>
      )}

      {!isLoading && leagueIds.length > 0 && leagues && (
        <div className="grid gap-3">
          {leagues.map((result, index) => {
            const data = result?.result as
              | [bigint, string, string, boolean]
              | undefined;

            if (!data) return null;
            const [id, name, creator, exists] = data;
            if (!exists) return null;

            return (
              <LeagueCard
                key={id.toString()}
                id={id}
                name={name}
                creator={creator}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
