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
  first_video_timestamp?: string;
  most_rewatched_url?: string;
  most_rewatched_title?: string;
  most_rewatched_timestamp?: string;
  rewatch_count?: number;
  favorite_creator_url?: string;
  favorite_creator_name?: string;
  favorite_creator_watch_count?: number;
}

export interface WordCloudData {
  [word: string]: number;  // e.g., {"funny cats": 10, "python tutorial": 8}
}