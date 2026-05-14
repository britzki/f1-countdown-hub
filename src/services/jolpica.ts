import type { Race } from '../types/f1';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export async function fetchCalendar(season: string | number = 2026): Promise<Race[]> {
  const res = await fetch(`${BASE_URL}/${season}/races/?format=json&limit=30`);

  if (!res.ok) throw new Error(`Erro ao buscar calendário: ${res.status}`);

  const data = await res.json();
  return data?.MRData?.RaceTable?.Races ?? [];
}
export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    code?: string;
  };
  Constructors: {
    name: string;
    constructorId: string;
  }[];
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

export async function fetchDriverStandings(season: string | number = 2026): Promise<DriverStanding[]> {
  const res = await fetch(`${BASE_URL}/${season}/driverstandings/?format=json`);
  if (!res.ok) throw new Error(`Erro: ${res.status}`);
  const data = await res.json();
  return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
}

export async function fetchConstructorStandings(season: string | number = 2026): Promise<ConstructorStanding[]> {
  const res = await fetch(`${BASE_URL}/${season}/constructorstandings/?format=json`);
  if (!res.ok) throw new Error(`Erro: ${res.status}`);
  const data = await res.json();
  return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
}