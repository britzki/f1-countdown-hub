import { useEffect, useState } from 'react';
import type { Race } from '../../types/f1';

interface Props {
  race: Race;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Session {
  label: string;
  date: string;
  time?: string;
}

function buildSessions(race: Race): Session[] {
  const sessions: Session[] = [];
  if (race.FirstPractice) sessions.push({ label: 'FP1', ...race.FirstPractice });
  if (race.SecondPractice) sessions.push({ label: 'FP2', ...race.SecondPractice });
  const sq = race.SprintQualifying ?? race.SprintShootout;
  if (sq) sessions.push({ label: 'Sprint Qual', ...sq });
  if (race.Sprint) sessions.push({ label: 'Sprint', ...race.Sprint });
  if (race.ThirdPractice) sessions.push({ label: 'FP3', ...race.ThirdPractice });
  if (race.Qualifying) sessions.push({ label: 'Quali', ...race.Qualifying });
  sessions.push({ label: 'Corrida', date: race.date, time: race.time });
  return sessions;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short',
  });
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5) + ' UTC';
}

function calcTimeLeft(targetDate: string, targetTime?: string): TimeLeft {
  const target = new Date(targetDate + 'T' + (targetTime ?? '12:00:00'));
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function CountdownBanner({ race }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calcTimeLeft(race.date, race.time)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(race.date, race.time));
    }, 1000);
    return () => clearInterval(interval);
  }, [race]);

  const sessions = buildSessions(race);

  return (
    <div className="bg-white dark:bg-gray-800 border border-red-100 dark:border-gray-700 rounded-xl overflow-hidden mb-6">
      <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
        <span className="text-white text-xs font-medium uppercase tracking-widest">
          Próximo GP
        </span>
      </div>

      <div className="px-4 pt-4 pb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">{race.raceName}</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
          <span>{race.Circuit.circuitName}</span>
          <span>·</span>
          <span>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
        </p>
      </div>

      <div className="grid grid-cols-4 border-t border-gray-100 dark:border-gray-700">
        {[
          { label: 'dias', value: timeLeft.days },
          { label: 'horas', value: timeLeft.hours },
          { label: 'min', value: timeLeft.minutes },
          { label: 'seg', value: timeLeft.seconds },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-4 border-r border-gray-100 last:border-r-0">
            <span className="text-2xl font-medium text-gray-900 dark:text-gray-100 tabular-nums">
              {pad(value)}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {sessions.map((s) => (
            <div key={s.label} className="px-4 py-3 border-r border-b border-gray-100 last:border-r-0">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-0.5">{s.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(s.date)}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{formatTime(s.time)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}