"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { GammaMarket } from "../lib/polymarket";
import { MarketCard } from "./MarketCard";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface MarketsClientProps {
  initialMarkets: GammaMarket[];
}

export function MarketsClient({ initialMarkets }: MarketsClientProps) {
  const [markets, setMarkets] = useState<GammaMarket[]>(initialMarkets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setMarkets(initialMarkets);
  }, [initialMarkets]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const m of markets) {
      if (m.slug) {
        const cat = m.slug.split(":")[0] ?? "";
        if (cat) set.add(cat);
      }
    }
    return Array.from(set);
  }, [markets]);

  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const q = (m.question ?? "").toLowerCase();
      const matchesSearch = q.includes(searchQuery.toLowerCase());
      const slugCategory = m.slug ? m.slug.split(":")[0] ?? "" : "";
      const matchesCategory =
        !selectedCategory || slugCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [markets, searchQuery, selectedCategory]);

  return (
    <div className="py-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Active Prediction Markets
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Browse live markets from Polymarket Gamma API and select a market
            to forecast inside your league.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Filter className="h-4 w-4 text-slate-500" />
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {!markets.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="text-xs text-slate-400">
            No markets found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.map((m) => (
              <MarketCard
                key={m.conditionId}
                market={m}
                footer={
                  <Link
                    href={`/leagues?conditionId=${encodeURIComponent(
                      m.conditionId
                    )}`}
                    className="text-xs px-2 py-1 border border-slate-700 rounded hover:bg-slate-800 inline-flex items-center justify-center"
                  >
                    Select for forecasting
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

