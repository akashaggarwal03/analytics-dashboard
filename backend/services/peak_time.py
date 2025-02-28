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

        result = {
            "year": peak_times["year"].to_list(),
            "hour": peak_times["hour"].to_list(),
            "watch_count": peak_times["watch_count"].to_list(),
            "day_of_week_year": day_counts["year"].to_list(),
            "day_of_week": day_counts["day_of_week"].to_list(),
            "day_of_week_count": day_counts["watch_count"].to_list(),
        }
        print("Peak times data:", result)
        return result