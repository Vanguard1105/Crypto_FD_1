export interface PriceData {
  timestamp: number;
  price: number;
  average?: number;
}

export type TimePeriod = 'ms' | '5m' | '1h' | '1d' | '7d';

export interface TimeSeriesData {
  [key: string]: PriceData[];
}

export type Theme = 'dark' | 'light';

export interface DrawingState {
  isActive: boolean;
  startTime: number;
  endTime: number;
  startPrice: number;
}