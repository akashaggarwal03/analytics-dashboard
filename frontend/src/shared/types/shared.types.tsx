export interface WebSocketMessage {
    type: string;
    data: any; // Refine later based on specific types
  }
  
  export interface PeakTimesData {
    year: number[];
    hour: number[];
    watch_count: number[];
  }