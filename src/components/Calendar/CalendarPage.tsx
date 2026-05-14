import { CountdownBanner } from '../Countdown/CountdownBanner';
import { useEffect, useMemo, useState } from 'react';
import type { Race, RaceStatus } from '../../types/f1';
import { fetchCalendar } from '../../services/jolpica';
import { RaceCard } from './RaceCard';

type Filter = 'all' | 'past' | 'upcoming';

function getRaceStatus(race: Race, now: Date): RaceStatus {
  const raceDate = new Date(race.date + 'T' + (race.time ?? '12:00:00'));
  if (raceDate < now) return 'past';
  const diffDays = (raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14 ? 'next' : 'upcoming';
}

export function CalendarPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    fetchCalendar(2026)
      .then(setRaces)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const nextRoundIndex = useMemo(() => {
    return races.findIndex((r) => getRaceStatus(r, now) !== 'past');
  }, [races, now]);

  const filtered = useMemo(() => {
    if (filter === 'past') return races.filter((r) => getRaceStatus(r, now) === 'past');
    if (filter === 'upcoming') return races.filter((r) => getRaceStatus(r, now) !== 'past');
    return races;
  }, [races, filter, now]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
      Carregando calendário...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-20 text-red-400 text-sm">
      Erro: {error}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Temporada</h1>
          <span className="text-xs font-medium bg-red-600 text-white px-2.5 py-1 rounded-md">2026</span>
        </div>

        <div className="flex gap-1.5">
          {(['all', 'past', 'upcoming'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium
                  ${filter === f
                    ? 'bg-red-700 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {{ all: 'Todos', past: 'Passados', upcoming: 'Próximos' }[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {races[nextRoundIndex] && (
            <CountdownBanner race={races[nextRoundIndex]} />
        )}
        {filtered.map((race) => {
          const status = getRaceStatus(race, now);
          const isNextGlobal = races.indexOf(race) === nextRoundIndex;
          return (
            <RaceCard
              key={race.round}
              race={race}
              status={status}
              defaultOpen={isNextGlobal}
            />
          );
        })}
      </div>
    </div>
  );
}