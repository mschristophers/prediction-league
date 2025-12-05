 "use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  TrendingUp,
  Users,
  Trophy,
  Target,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#22c55e20,_transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-2 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs md:text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="font-medium text-slate-200">
              Forecast Polymarket outcomes with your friends on Base
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Forecast the future,
            <br />
            <span className="text-emerald-400">climb the league table</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-slate-300 md:text-lg">
            Spin up a league on Base, submit 0–100% forecasts on Polymarket
            markets, and turn your group&apos;s intuition into a live,
            trackable leaderboard.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button size="lg" className="text-base px-8">
              <Link href="/leagues/create" className="flex items-center gap-2">
                Create a league
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 border-slate-700"
            >
              <Link href="/markets">Browse markets</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-2">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-2">
              How it works
            </h2>
            <p className="text-sm text-slate-300 md:text-base">
              A simple league format that turns real Polymarket markets into
              friendly competition.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-slate-800/80 hover:border-emerald-500/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Create a league</h3>
                <p className="text-sm text-slate-300">
                  Launch a league for your DAO, class, or group chat in a single
                  click and invite people to join.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-800/80 hover:border-emerald-500/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Submit forecasts</h3>
                <p className="text-sm text-slate-300">
                  Browse markets, pick a question, and slide in your
                  probabilities instead of just guessing yes or no.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-800/80 hover:border-emerald-500/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Trophy className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Track scores</h3>
                <p className="text-sm text-slate-300">
                  Watch a shared leaderboard update as markets resolve and your
                  league discovers who really forecasts well.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 py-10">
        <div className="mx-auto grid max-w-4xl gap-6 px-2 md:grid-cols-3">
          <div className="text-center space-y-1">
            <div className="text-3xl font-bold text-emerald-400">Live</div>
            <div className="text-xs text-slate-400">Polymarket-backed leagues</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl font-bold text-emerald-400">0–100%</div>
            <div className="text-xs text-slate-400">
              Probabilistic forecasts, not just yes/no
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl font-bold text-emerald-400">On-chain</div>
            <div className="text-xs text-slate-400">
              Scores portable on Base Sepolia
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-2">
          <Card className="border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950">
            <CardContent className="flex flex-col items-center space-y-5 py-10 text-center">
              <TrendingUp className="h-10 w-10 text-emerald-400" />
              <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to see who actually forecasts well?
              </h2>
              <p className="max-w-xl text-sm text-slate-300 md:text-base">
                Spin up a league, connect your wallet, and start logging
                predictions that turn Polymarket markets into bragging rights
                for your group.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button size="lg" className="text-base px-8">
                  <Link
                    href="/leagues/create"
                    className="flex items-center gap-2"
                  >
                    Create your league
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 border-slate-700"
                >
                  <Link href="/markets">Explore markets</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

  
