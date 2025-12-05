"use client";

import React from "react";
import { GammaMarket, parseOutcomePrices } from "../lib/polymarket";

interface Props {
  market: GammaMarket;
  footer?: React.ReactNode;
}

export function MarketCard({ market, footer }: Props) {
  const yesPrice = parseOutcomePrices(market)[0] ?? 0;
  const impliedYes = (yesPrice * 100).toFixed(1);

  return (
    <div className="card space-y-2">
      <div className="text-sm text-slate-400">{market.slug}</div>
      <div className="font-medium">{market.question}</div>
      <div className="text-xs text-slate-400">
        {market.endDate
          ? `Ends: ${new Date(market.endDate).toLocaleString()}`
          : "End date not available"}
      </div>
      <div className="flex justify-between items-center text-sm">
        <span>
          Market odds (YES):{" "}
          <span className="font-semibold">{impliedYes}%</span>
        </span>
        <button
          type="button"
          className="text-xs px-2 py-1 border border-slate-700 rounded hover:bg-slate-800"
          onClick={() => navigator.clipboard.writeText(market.conditionId)}
        >
          Copy Market ID
        </button>
      </div>
      {footer && <div className="pt-1">{footer}</div>}
    </div>
  );
}
