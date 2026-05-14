export interface SessionInfo {
  date: string;
  time?: string;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  Location: {
    locality: string;
    country: string;
    lat: string;
    long: string;
  };
}

export interface Race {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: Circuit;
  FirstPractice?: SessionInfo;
  SecondPractice?: SessionInfo;
  ThirdPractice?: SessionInfo;
  Sprint?: SessionInfo;
  SprintQualifying?: SessionInfo;
  SprintShootout?: SessionInfo;
  Qualifying?: SessionInfo;
}

export type RaceStatus = 'past' | 'next' | 'upcoming';