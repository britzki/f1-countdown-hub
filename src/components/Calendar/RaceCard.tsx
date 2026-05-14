import { useState } from 'react';
import type { Race, RaceStatus } from '../../types/f1';
import { SessionsPanel } from './SessionsPanel';

const FLAGS: Record<string, string> = {
  Australia: '🇦🇺', China: '🇨🇳', Japan: '🇯🇵', Bahrain: '🇧🇭',
  'Saudi Arabia': '🇸🇦', USA: '🇺🇸', Italy: '🇮🇹', Monaco: '🇲🇨',
  Spain: '🇪🇸', Canada: '🇨🇦', Austria: '🇦🇹', 'Great Britain': '🇬🇧',
  Belgium: '🇧🇪', Hungary: '🇭🇺', Netherlands: '🇳🇱', Azerbaijan: '🇦🇿',
  Singapore: '🇸🇬', Mexico: '🇲🇽', Brazil: '🇧🇷', Qatar: '🇶🇦',
  'Abu Dhabi': '🇦🇪',
};

interface Props {
  race: Race;
  status: RaceStatus;
  defaultOpen?: boolean;
}

const STATUS_STYLES: Record<RaceStatus, string> = {
  past: 'bg-gray-100 text-gray-400',
  next: 'bg-red-600 text-white',
  upcoming: 'bg-blue-50 text-blue-600',
};

const STATUS_LABELS: Record<RaceStatus, string> = {
  past: 'Realizado',
  next: 'Próximo GP',
  upcoming: 'Em breve',
};

export function RaceCard({ race, status, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const flag = FLAGS[race.Circuit.Location.country] ?? '🏁';
  const date = new Date(race.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-xl overflow-hidden transition-all
      ${status === 'next'
        ? 'border-2 border-red-600'
        : 'border border-gray-100 hover:border-gray-200'
      }`}
    >
      <button
        className="w-full grid grid-cols-[52px_1fr_auto] items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex flex-col items-center gap-0.5">
          {status === 'next' && (
            <span className="text-[10px] uppercase tracking-widest text-red-600 font-medium">próximo</span>
          )}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
            ${status === 'next' ? 'bg-red-600 text-white'
            : status === 'past' ? 'bg-gray-100 text-gray-400'
            : 'border border-gray-200 text-gray-600'}`}
          >
            {race.round}
          </div>
          <span className="text-[10px] text-gray-300">R{race.round}</span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{race.raceName}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
            <span>{flag}</span>
            <span>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">{date}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && <SessionsPanel race={race} />}
    </div>
  );
}