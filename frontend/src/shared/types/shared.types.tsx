export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface PeakTimesData {
  year: number[];
  hour: number[];
  watch_count: number[];
  day_of_week_year: number[];
  day_of_week: number[]; // 1 = Monday, 7 = Sunday
  day_of_week_count: number[];
}