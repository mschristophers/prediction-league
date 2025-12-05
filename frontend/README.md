# Prediction League Frontend

Next.js frontend application for the Prediction League DApp.

## Environment Setup

The frontend requires environment variables to be set in `frontend/.env.local`. 

### Quick Setup

If your root `.env` file contains `NEXT_PUBLIC_*` variables, run:

```bash
# From project root
./scripts/sync-frontend-env.sh
```

Or manually create `frontend/.env.local` with:

```bash
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=your_rpc_url
NEXT_PUBLIC_PREDICTION_LEAGUE_ADDRESS=your_contract_address
POLYMARKET_GAMMA_URL=https://gamma-api.polymarket.com
```

### Required Variables

- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` - Base Sepolia RPC endpoint
- `NEXT_PUBLIC_PREDICTION_LEAGUE_ADDRESS` - Deployed contract address
- `POLYMARKET_GAMMA_URL` - Polymarket API base URL (optional, has default)

## Development

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000

## Troubleshooting

If you see 404 errors or environment variable warnings:

1. Ensure `.env.local` exists in the `frontend/` directory
2. Restart the Next.js dev server after changing env variables
3. Clear `.next` cache if needed: `rm -rf .next && npm run dev`

