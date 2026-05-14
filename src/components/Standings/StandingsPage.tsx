import { useState } from 'react';
import { DriversStandings } from './DriversStandings';
import { ConstructorsStandings } from './ConstructorsStandings';

type Tab = 'drivers' | 'constructors';

export function StandingsPage() {
  const [tab, setTab] = useState<Tab>('drivers');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Standings</h1>
          <span className="text-xs font-medium bg-red-600 text-white px-2.5 py-1 rounded-md">2026</span>
        </div>

        <div className="flex gap-1.5">
          {(['drivers', 'constructors'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium
                ${tab === t
                  ? 'bg-red-700 text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {{ drivers: 'Pilotos', constructors: 'Construtores' }[t]}
            </button>
          ))}
        </div>
      </div>

      {tab === 'drivers' ? <DriversStandings /> : <ConstructorsStandings />}
    </div>
  );
}