"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

interface LeaderboardEntry {
  address: string;
  displayName: string;
  score: number; // Brier penalty total (more negative = worse)
  isYou?: boolean;
}

interface LeagueLeaderboardProps {
  currentUserAddress?: string | null;
  currentUserScore?: bigint;
}

const MOCK_ENTRIES: LeaderboardEntry[] = [
  {
    address: "0x1111...aaaa",
    displayName: "CryptoOracle",
    score: -1200,
  },
  {
    address: "0x2222...bbbb",
    displayName: "MarketMaven",
    score: -1450,
  },
  {
    address: "0x3333...cccc",
    displayName: "PredictionPro",
    score: -1675,
  },
  {
    address: "0x4444...dddd",
    displayName: "DataDriven",
    score: -1890,
  },
];

export function LeagueLeaderboard({
  currentUserAddress,
  currentUserScore,
}: LeagueLeaderboardProps) {
  const hasUser =
    typeof currentUserAddress === "string" && currentUserAddress.length > 0;
  const hasNonZeroScore =
    typeof currentUserScore === "bigint" && currentUserScore !== 0n;

  // Only show the populated leaderboard once the viewer has actually
  // made at least one prediction (non-zero score). Until then, keep it empty.
  if (!hasUser || !hasNonZeroScore) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">League leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-400">
            No predictions in this league yet. Make the first one to open the
            leaderboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  const short =
    currentUserAddress.slice(0, 6) + "…" + currentUserAddress.slice(-4);
  const scoreNumber = Number(currentUserScore);

  let entries: LeaderboardEntry[] = [
    {
      address: short,
      displayName: "You",
      score: scoreNumber,
      isYou: true,
    },
    ...MOCK_ENTRIES,
  ];

  // Sort so "better" (less negative) penalties appear first.
  const sorted = [...entries].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">League leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="w-28 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((entry, index) => (
              <TableRow key={`${entry.address}-${index}`}>
                <TableCell className="text-xs text-slate-400">
                  #{index + 1}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {entry.displayName}
                    </span>
                    {entry.isYou && (
                      <Badge variant="outline" className="text-[10px]">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {entry.address}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm font-mono">
                  {entry.score}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-100">
                    Live
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-3 text-[11px] text-slate-500">
          Scores reflect how accurate each person&apos;s predictions have been across the
          markets used in this league.
        </p>
      </CardContent>
    </Card>
  );
}
