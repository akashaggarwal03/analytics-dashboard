export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface PeakTimesData {
  year: number[];
  hour: number[];
  watch_count: number[];
  day_of_week_year: number[];
  day_of_week: number[];
  day_of_week_count: number[];
  first_video_url?: string;
  first_video_title?: string;
  first_video_timestamp?: string;  // Add timestamp as ISO string
}