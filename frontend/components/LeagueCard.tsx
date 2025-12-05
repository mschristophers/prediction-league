"use client";

import Link from "next/link";

interface Props {
  id: bigint;
  name: string;
  creator: string;
}

export function LeagueCard({ id, name, creator }: Props) {
  const idString = id.toString();

  return (
    <Link href={`/leagues/${idString}`}>
      <div className="card space-y-2 cursor-pointer hover:border-emerald-500/60 transition-colors">
        <div className="text-xs text-slate-400">League #{idString}</div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-slate-500">
          Creator: {creator.slice(0, 6)}…{creator.slice(-4)}
        </div>
      </div>
    </Link>
  );
}
