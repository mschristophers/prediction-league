import { Hex } from "viem";
import { predictionLeagueAbi } from "./abi/PredictionLeague";

export const predictionLeagueAddress =
  (process.env.NEXT_PUBLIC_PREDICTION_LEAGUE_ADDRESS as Hex | undefined) ??
  ("0x0000000000000000000000000000000000000000" as Hex);

export const predictionLeagueConfig = {
  address: predictionLeagueAddress,
  abi: predictionLeagueAbi
} as const;
