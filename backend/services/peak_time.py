import polars as pl
from typing import Dict, List

class PeakTimeService:
    def calculate(self, watch_df: pl.DataFrame) -> Dict[str, List[int]]:
        peak_times = (
            watch_df.group_by([pl.col("timestamp").dt.year().alias("year"), pl.col("timestamp").dt.hour().alias("hour")])
            .agg(pl.count().alias("watch_count"))
            .sort(["year", "hour"])
        )

        # Calculate day of week counts
        day_counts = (
            watch_df.group_by([pl.col("timestamp").dt.year().alias("year"), pl.col("day_of_week")])
            .agg(pl.count().alias("watch_count"))
            .sort(["year", "day_of_week"])
        )

        # Extract first video URL, title, and timestamp from the DataFrame
        first_video_row = watch_df.filter(pl.col("first_video_url").is_not_null()).head(1)
        first_video_url = first_video_row["first_video_url"][0] if not first_video_row.is_empty() else None
        first_video_title = first_video_row["first_video_title"][0] if not first_video_row.is_empty() else None
        first_video_timestamp = first_video_row["first_video_timestamp"][0] if not first_video_row.is_empty() else None

        result = {
            "year": peak_times["year"].to_list(),
            "hour": peak_times["hour"].to_list(),
            "watch_count": peak_times["watch_count"].to_list(),
            "day_of_week_year": day_counts["year"].to_list(),
            "day_of_week": day_counts["day_of_week"].to_list(),
            "day_of_week_count": day_counts["watch_count"].to_list(),
            "first_video_url": first_video_url,
            "first_video_title": first_video_title,
            "first_video_timestamp": first_video_timestamp.isoformat() if first_video_timestamp else None  # Convert to ISO string
        }
        print("Peak times data:", result)
        return result