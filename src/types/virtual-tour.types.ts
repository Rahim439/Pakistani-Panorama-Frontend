import { Place } from './emergency.types';

export interface HistoricalPlace extends Place {
  editorialSummary?: {
    text: string;
  };
  websiteUri?: string;
  historicalInfo?: {
    name: string;
    city: string;
  };
} 