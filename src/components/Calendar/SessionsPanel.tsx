import type { Race } from '../../types/f1';

interface Session {
  label: string;
  date: string;
  time?: string;
}

interface Props {
  race: Race;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5) + ' UTC';
}

function buildSessions(race: Race): Session[] {
  const sessions: Session[] = [];

  if (race.FirstPractice)
    sessions.push({ label: 'FP1', ...race.FirstPractice });
  if (race.SecondPractice)
    sessions.push({ label: 'FP2', ...race.SecondPractice });
  if (race.SprintQualifying ?? race.SprintShootout) {
    const s = (race.SprintQualifying ?? race.SprintShootout)!;
    sessions.push({ label: 'Sprint Qual', ...s });
  }
  if (race.Sprint)
    sessions.push({ label: 'Sprint', ...race.Sprint });
  if (race.ThirdPractice)
    sessions.push({ label: 'FP3', ...race.ThirdPractice });
  if (race.Qualifying)
    sessions.push({ label: 'Quali', ...race.Qualifying });

  sessions.push({ label: 'Corrida', date: race.date, time: race.time });

  return sessions;
}

export function SessionsPanel({ race }: Props) {
  const sessions = buildSessions(race);

  return (
    <div className="border-t border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {sessions.map((s) => (
          <div key={s.label} className="px-4 py-3 border-r border-b border-gray-100 dark:border-gray-700 last:border-r-0 dark:bg-gray-800">
            <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(s.date)}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{formatTime(s.time)}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-2">
        <span className="text-xs text-gray-400">Circuito:</span>
        <span className="text-xs font-medium text-gray-700">{race.Circuit.circuitName}</span>
      </div>
    </div>
  );
}