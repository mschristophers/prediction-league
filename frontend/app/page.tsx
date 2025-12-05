export default function HomePage() {
    return (
      <div className="space-y-6">
        <section className="card space-y-3">
          <h1 className="text-2xl font-semibold">
            Prediction League on Base + Polymarket
          </h1>
          <p className="text-sm text-slate-300">
            Turn Polymarket markets into a free forecasting league for any group:
            student clubs, DAOs, friend groups, or group chats.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            <li>Create a league on Base.</li>
            <li>Pick Polymarket markets and submit forecasts (0–100%).</li>
            <li>
              When markets resolve, an off-chain script scores accuracy and
              updates on-chain scores.
            </li>
          </ul>
        </section>
  
        <section className="grid gap-4 md:grid-cols-2">
          <a href="/markets" className="card hover:bg-slate-900/80">
            <h2 className="font-semibold mb-1">Browse markets</h2>
            <p className="text-sm text-slate-300">
              View a few Polymarket markets and copy conditionIds for your league.
            </p>
          </a>
          <a href="/leagues/create" className="card hover:bg-slate-900/80">
            <h2 className="font-semibold mb-1">Create a league</h2>
            <p className="text-sm text-slate-300">
              Spin up a new league on Base Sepolia for your group in one
              transaction.
            </p>
          </a>
        </section>
  
        <section className="card text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">How it scores</div>
          <p>
            We use Polymarket as the reference probability and outcome. When a
            market resolves, a script calls the contract&apos;s{" "}
            <span className="font-mono">setMarketOutcome</span> and{" "}
            <span className="font-mono">updateScore</span> with a Brier penalty
            per user. Scores accumulate per league.
          </p>
          <p>
            That keeps on-chain logic minimal while still making forecasting
            reputation verifiable and portable on Base.
          </p>
        </section>
      </div>
    );
  }
  