import json
import polars as pl
from models.schemas import WatchEntry

def parse_watch_history(content: bytes) -> pl.DataFrame:
    data = json.loads(content)
    watches = [
        {
            "title": entry["title"].replace("Watched ", ""),
            "url": entry["titleUrl"],
            "timestamp": entry["time"]
        }
        for entry in data
        if "title" in entry and "Watched " in entry["title"] and "titleUrl" in entry
    ]
    df = pl.DataFrame(watches)
    df = df.with_columns(
        pl.col("timestamp").str.strptime(pl.Datetime, "%Y-%m-%dT%H:%M:%S%.fZ", strict=False)
    ).with_columns(
        pl.col("timestamp").dt.weekday().alias("day_of_week")  # 1 = Monday, 7 = Sunday
    )
    
    # Sort by timestamp to find the first video
    sorted_df = df.sort("timestamp")
    
    # Get the first video's URL, title, and timestamp
    first_video_url = sorted_df["url"][0] if not sorted_df.is_empty() else None
    first_video_title = sorted_df["title"][0] if not sorted_df.is_empty() else None
    first_video_timestamp = sorted_df["timestamp"][0] if not sorted_df.is_empty() else None
    
    # Add first_video_url, first_video_title, and first_video_timestamp as columns
    sorted_df = sorted_df.with_columns([
        pl.when(pl.col("url") == first_video_url)
          .then(pl.lit(first_video_url))
          .otherwise(pl.lit(None))
          .alias("first_video_url"),
        pl.when(pl.col("url") == first_video_url)
          .then(pl.lit(first_video_title))
          .otherwise(pl.lit(None))
          .alias("first_video_title"),
        pl.when(pl.col("url") == first_video_url)
          .then(pl.lit(first_video_timestamp))
          .otherwise(pl.lit(None))
          .alias("first_video_timestamp")
    ])
    
    print("Parsed days of week:", sorted_df["day_of_week"].to_list())
    print("First video URL:", first_video_url)
    print("First video title:", first_video_title)
    print("First video timestamp:", first_video_timestamp)
    print("DataFrame with first video details:", sorted_df)
    return sorted_df