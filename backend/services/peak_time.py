import polars as pl

class PeakTimeService:
    def calculate(self, watch_df: pl.DataFrame) -> dict:
        peak_times = (
            watch_df.group_by([pl.col("timestamp").dt.year().alias("year"), pl.col("timestamp").dt.hour().alias("hour")])
            .agg(pl.count().alias("watch_count"))
            .sort(["year", "hour"])
        )
        result =  {
            "year": peak_times["year"].to_list(),
            "hour": peak_times["hour"].to_list(),
            "watch_count": peak_times["watch_count"].to_list()
        }

        #print("Peak times data:", result)  # Debug log
        return result