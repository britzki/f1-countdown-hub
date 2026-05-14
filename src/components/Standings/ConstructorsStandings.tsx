import { useEffect, useState } from 'react';
import { fetchConstructorStandings, type ConstructorStanding } from '../../services/jolpica';

const TEAM_COLORS: Record<string, string> = {
  mclaren: 'bg-orange-400',
  ferrari: 'bg-red-600',
  red_bull: 'bg-blue-700',
  mercedes: 'bg-teal-400',
  aston_martin: 'bg-green-700',
  alpine: 'bg-pink-500',
  haas: 'bg-gray-400',
  williams: 'bg-blue-400',
  sauber: 'bg-green-500',
  rb: 'bg-blue-500',
  kick_sauber: 'bg-green-500',
};

function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? 'bg-gray-300';
}

export function ConstructorsStandings() {
  const [standings, setStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConstructorStandings(2026)
      .then(setStandings)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="text-center py-12 text-sm text-gray-400">Carregando...</div>
  );
  if (error) return (
    <div className="text-center py-12 text-sm text-red-400">Erro: {error}</div>
  );

  return (
    <div className="flex flex-col gap-2">
      {standings.map((s) => {
        const isTop3 = Number(s.position) <= 3;

        return (
          <div
            key={s.Constructor.constructorId}
            className={`bg-white dark:bg-gray-800 border rounded-xl px-4 py-3 flex items-center gap-4
            ${isTop3 ? 'border-gray-200 dark:border-gray-600' : 'border-gray-100 dark:border-gray-700'}`}>
            <span className={`text-sm font-medium w-6 text-center
              ${s.position === '1' ? 'text-yellow-500' :
                s.position === '2' ? 'text-gray-400' :
                s.position === '3' ? 'text-amber-600' :
                'text-gray-300'}`}
            >
              {s.position}
            </span>

            <div className={`w-1 h-8 rounded-full ${getTeamColor(s.Constructor.constructorId)}`} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.Constructor.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{s.Constructor.nationality}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.points}</p>
              <p className="text-[11px] text-gray-400">pts</p>
            </div>

            {Number(s.wins) > 0 && (
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-medium text-gray-700">{s.wins}</p>
                <p className="text-[11px] text-gray-400">vitórias</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}