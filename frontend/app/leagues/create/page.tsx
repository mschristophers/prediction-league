"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract
} from "wagmi";
import { predictionLeagueConfig } from "../../../lib/contract";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Users } from "lucide-react";

export default function CreateLeaguePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdId, setCreatedId] = useState<bigint | null>(null);
  const router = useRouter();

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const { data: nextLeagueId } = useReadContract({
    ...predictionLeagueConfig,
    functionName: "nextLeagueId",
    query: { enabled: isSuccess } // only refetch after tx
  });

  const disabled = isPending || confirming || !name.trim();

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
    <div className="py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <Users className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create a Prediction League
          </h1>
          <p className="text-sm text-slate-300">
            Deploy a league on Base and invite your group to forecast
            Polymarket markets together.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>League details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">League name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Crypto Forecasting League"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional: describe what you&apos;ll be forecasting."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-slate-400">
                  This description is off-chain for now; scores and forecasts
                  live on Base.
                </p>
              </div>

              <Button
                type="submit"
                disabled={disabled}
                size="lg"
                className="w-full"
              >
                {isPending || confirming ? "Creating..." : "Create league"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {createdId && (
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="pt-4 space-y-2 text-sm text-slate-200">
              <div>League created on Base Sepolia.</div>
              <div>
                League ID:{" "}
                <span className="font-mono text-emerald-400">
                  {createdId.toString()}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Share this ID with your group, then{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() =>
                    router.push(`/leagues/${createdId.toString()}`)
                  }
                >
                  open the league page
                </button>{" "}
                to start forecasting.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
