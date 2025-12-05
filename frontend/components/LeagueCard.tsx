interface Props {
    id: bigint;
    name: string;
    creator: string;
  }
  
  export function LeagueCard({ id, name, creator }: Props) {
    return (
      <div className="card space-y-2">
        <div className="text-xs text-slate-400">League #{id.toString()}</div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-slate-500">
          Creator: {creator.slice(0, 6)}…{creator.slice(-4)}
        </div>
      </div>
    );
  }
  