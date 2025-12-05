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
  let entries: LeaderboardEntry[] = [...MOCK_ENTRIES];

  if (currentUserAddress) {
    const short =
      currentUserAddress.slice(0, 6) +
      "…" +
      currentUserAddress.slice(-4);
    const scoreNumber =
      currentUserScore !== undefined ? Number(currentUserScore) : 0;

    const existingIndex = entries.findIndex(
      (e) => e.address.toLowerCase() === short.toLowerCase()
    );

    const youEntry: LeaderboardEntry = {
      address: short,
      displayName: "You",
      score: scoreNumber,
      isYou: true,
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = youEntry;
    } else {
      entries = [youEntry, ...entries];
    }
  }

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
              <TableHead className="text-right">Brier score</TableHead>
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
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-slate-800 text-slate-100"
                  >
                    Pending resolution
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-3 text-[11px] text-slate-500">
          Scores are Brier penalties aggregated per league. An off-chain script
          reads Polymarket outcomes and updates these values on Base.
        </p>
      </CardContent>
    </Card>
  );
}

