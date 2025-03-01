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

        # Extract first video details from the DataFrame
        first_video_row = watch_df.filter(pl.col("first_video_url").is_not_null()).head(1)
        first_video_url = first_video_row["first_video_url"][0] if not first_video_row.is_empty() else None
        first_video_title = first_video_row["first_video_title"][0] if not first_video_row.is_empty() else None
        first_video_timestamp = first_video_row["first_video_timestamp"][0] if not first_video_row.is_empty() else None

        # Extract most rewatched video details from the DataFrame
        most_rewatched_row = watch_df.filter(pl.col("most_rewatched_url").is_not_null()).head(1)
        most_rewatched_url = most_rewatched_row["most_rewatched_url"][0] if not most_rewatched_row.is_empty() else None
        most_rewatched_title = most_rewatched_row["most_rewatched_title"][0] if not most_rewatched_row.is_empty() else None
        most_rewatched_timestamp = most_rewatched_row["most_rewatched_timestamp"][0] if not most_rewatched_row.is_empty() else None
        rewatch_count = most_rewatched_row["rewatch_count"][0] if not most_rewatched_row.is_empty() else 0

        # Extract favorite creator details from the DataFrame
        favorite_creator_row = watch_df.filter(pl.col("favorite_creator_url").is_not_null() & (pl.col("favorite_creator_url") != "")).head(1)
        favorite_creator_url = favorite_creator_row["favorite_creator_url"][0] if not favorite_creator_row.is_empty() else None
        favorite_creator_name = favorite_creator_row["favorite_creator_name"][0] if not favorite_creator_row.is_empty() else None
        favorite_creator_watch_count = favorite_creator_row["favorite_creator_watch_count"][0] if not favorite_creator_row.is_empty() else 0

        result = {
            "year": peak_times["year"].to_list(),
            "hour": peak_times["hour"].to_list(),
            "watch_count": peak_times["watch_count"].to_list(),
            "day_of_week_year": day_counts["year"].to_list(),
            "day_of_week": day_counts["day_of_week"].to_list(),
            "day_of_week_count": day_counts["watch_count"].to_list(),
            "first_video_url": first_video_url,
            "first_video_title": first_video_title,
            "first_video_timestamp": first_video_timestamp.isoformat() if first_video_timestamp else None,
            "most_rewatched_url": most_rewatched_url,
            "most_rewatched_title": most_rewatched_title,
            "most_rewatched_timestamp": most_rewatched_timestamp.isoformat() if most_rewatched_timestamp else None,
            "rewatch_count": int(rewatch_count),
            "favorite_creator_url": favorite_creator_url,
            "favorite_creator_name": favorite_creator_name,
            "favorite_creator_watch_count": int(favorite_creator_watch_count)
        }
        # print("Peak times data:", result)
        return result