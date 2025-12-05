# Prediction League

Turn Polymarket markets into friendly forecasting leagues on Base. Groups create leagues, make 0–100% probability predictions, and compare how well they forecast as markets resolve.

---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Architecture](#architecture)
   - [Smart Contracts](#smart-contracts)
   - [Backend Scripts](#backend-scripts)
   - [Frontend](#frontend)
3. [Deployed Contracts](#deployed-contracts)
4. [Setup](#setup)
5. [Running Locally](#running-locally)
6. [Key Flows](#key-flows)
7. [Technical Notes](#technical-notes)

---

## High-Level Overview

Prediction League lets any group (DAO, class, group chat) spin up a league on Base and use Polymarket markets as the source of truth. Members submit probability forecasts (0–100%) on markets; as markets resolve, scores update and a league leaderboard shows who forecasts best.

The core idea:

- **Polymarket** provides real-world markets and outcomes.
- **Base** stores leagues, predictions, and scores.
- A small **off-chain script** watches Polymarket, computes Brier-based score updates, and writes them back to the contract.

---

## Architecture

### Smart Contracts

Location: `contracts/PredictionLeague.sol`

- `PredictionLeague` (Ownable):
  - `createLeague(string name)` – creates a new league (id, name, creator, exists).
  - `submitPrediction(uint256 leagueId, bytes32 marketId, uint8 forecast)` – stores or updates a user’s probabilistic forecast (0–100) for a given market in a league.
  - `setMarketOutcome(bytes32 marketId, bool outcome)` – owner-only; records whether the market resolved YES/NO.
  - `updateScore(uint256 leagueId, address user, int256 scoreDelta)` – owner-only; applies a Brier-based score delta for a user in a league.
  - `getScore(uint256 leagueId, address user)` – returns the user’s current aggregate score for that league.

The contract is intentionally minimal: it stores leagues, forecasts, outcomes and scores; calculation of score deltas happens off-chain.

### Backend Scripts

Location: `scripts/`

- `scripts/polymarket.ts`
  - Shared Polymarket Gamma client used across scripts and mirrored in the frontend under `frontend/lib/polymarket.ts`.
  - Fetches markets via `https://gamma-api.polymarket.com/markets` with flexible filters:
    - `fetchActiveMarkets`, `fetchClosedMarkets`, `fetchMarketByConditionId`.
    - `parseOutcomes` / `parseOutcomePrices` to decode Gamma’s string fields.

- `scripts/utils/scoring.ts`
  - Implements Brier scoring for binary outcomes:
    - `brierPenaltyScaled(forecastPercent, outcome)` – penalty in a scaled integer.
    - `scoreDeltaFromForecast` – converts penalty into a signed delta (higher = better).
  - Used by resolution scripts to compute `scoreDelta` before calling `updateScore`.

- `scripts/resolveMarkets.ts` (and related helpers)
  - Intended to:
    - Fetch resolved Polymarket markets.
    - Compute Brier deltas for each user’s forecast.
    - Call `setMarketOutcome` and `updateScore` on `PredictionLeague`.

### Frontend

Location: `frontend/` (Next.js 14, App Router)

- Tech stack:
  - Next.js (app directory) + React.
  - Tailwind CSS for styling.
  - Coinbase OnchainKit + wagmi + viem for wallet + contract calls.

- Key front-end modules:
  - `frontend/lib/polymarket.ts` – TypeScript mirror of `scripts/polymarket.ts`, including a **demo window** (closed markets between 2025-10-01 and 2025-10-31) used to keep demo markets consistent.
  - `frontend/lib/contract.ts` – `predictionLeagueConfig` (address + ABI) for wagmi.
  - `frontend/app/providers.tsx` – wraps the app in `WagmiProvider` and `OnchainKitProvider`.
  - `frontend/app/api/closed-markets/route.ts` – server-side route fetching demo closed markets from Polymarket Gamma.

---

## Deployed Contracts

Network: **Base Sepolia**

- `PredictionLeague`  
  `0x0D4D998d05FD12F0e4EeD7504745C8Aa5cC38859`  
  [View on BaseScan](https://sepolia.basescan.org/address/0x0D4D998d05FD12F0e4EeD7504745C8Aa5cC38859)

---

## Setup

From the repo root:

```bash
cd prediction-league
npm install
cd frontend
npm install
```

Environment variables:

- Root (for scripts): `.env`

```env
POLYMARKET_GAMMA_URL=https://gamma-api.polymarket.com
```

- Frontend: `frontend/.env.local`

```env
POLYMARKET_GAMMA_URL=https://gamma-api.polymarket.com
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=YOUR_BASE_SEPOLIA_RPC
NEXT_PUBLIC_PREDICTION_LEAGUE_ADDRESS=0x0D4D998d05FD12F0e4EeD7504745C8Aa5cC38859
NEXT_PUBLIC_ONCHAINKIT_API_KEY=YOUR_ONCHAINKIT_API_KEY
```

---

## Running Locally

### Smart Contracts & Scripts

Contracts are already deployed to Base Sepolia. If you want to re-run scripts locally:

```bash
cd prediction-league
npm run test           # run Hardhat tests
# scripts under scripts/ use POLYMARKET_GAMMA_URL from .env
```

### Frontend (Next.js)

```bash
cd prediction-league/frontend
npm run dev
# visit http://localhost:3000
```

The frontend is wired to the deployed `PredictionLeague` contract on Base Sepolia and to the Polymarket Gamma API via the shared Polymarket client.

---

## Key Flows

### 1. Home → markets → leagues

- Home (`/`):
  - Explains the product in one sentence.
  - Primary CTAs: **Create league** and **Browse markets**.

- Markets (`/markets`):
  - Uses `fetchClosedMarkets` with the shared demo window.
  - Search + category filters.
  - Each **MarketCard** shows:
    - Question, end time, `Market odds (YES)`, “Copy Market ID”.
    - “Use in my league” → passes `conditionId` via query.

### 2. Create a league

- Page: `/leagues/create`
  - Simple form:
    - League name (required).
    - Optional description (UI-only).
  - On submit:
    - Calls `PredictionLeague.createLeague(name)` via wagmi.
    - When confirmed, shows the new league ID and a link to open `/leagues/[leagueId]`.

### 3. League hub + leaderboard

- Page: `/leagues`
  - Reads `nextLeagueId` and loops over `leagues(id)` to show all leagues.

- Page: `/leagues/[leagueId]`
  - Shows:
    - League info (id, name, creator).
    - “Your performance in this league”:
      - Calls `getScore(leagueId, user)` to display your current score.
    - “League leaderboard”:
      - If no score yet: shows an empty state (“No predictions in this league yet…”).
      - Once you have a non-zero score: shows you + realistic dummy entries, sorted by score.
    - “Featured Polymarket markets”:
      - Fetched from `/api/closed-markets`, which uses `fetchClosedMarkets` with the demo window.
      - Each card has a **Make a prediction** button:
        - Routes to `/leagues/[leagueId]/predict?conditionId=...`.

### 4. Predict flow

- Page: `/leagues/[leagueId]/predict?conditionId=...`
  - Server component fetches the selected market via `fetchMarketByConditionId`.
  - Shows:
    - Market slug, question, end time, and Market ID.
    - `PredictionForm`:
      - Slider for 0–100% (“How likely do you think "YES" is?”).
      - Calls `submitPrediction(leagueId, marketId, forecast)` via wagmi.
      - On success:
        - Shows “Forecast stored on-chain”.
        - Provides:
          - “View transaction on BaseScan” (new tab).
          - “View league score” (back to `/leagues/[leagueId]`).

Once your off-chain script runs `setMarketOutcome` and `updateScore`, the score and leaderboard on the league page reflect those updates.

---

## Technical Notes

- **Shared Polymarket client**:  
  `scripts/polymarket.ts` and `frontend/lib/polymarket.ts` intentionally share the same `GammaMarket` shape, Gamma URL, and helper functions so frontend, scripts, and contract interactions stay in sync.

- **Scoring**:  
  Brier scoring is encapsulated in `scripts/utils/scoring.ts`. The contract only stores cumulative scores and does not expose internal prediction state; any indexing or richer analytics would be built on top of these primitives.

- **Wallet / Contract stack**:  
  Coinbase OnchainKit handles wallet UX, while wagmi + viem handle reads and writes against `PredictionLeague`. The two are wired together via a shared `wagmiConfig` and `OnchainKitProvider`.
