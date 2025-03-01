import json
import polars as pl
from models.schemas import WatchEntry

def parse_watch_history(content: bytes) -> pl.DataFrame:
    data = json.loads(content)
    watches = [
        {
            "title": entry["title"].replace("Watched ", ""),
            "url": entry["titleUrl"],
            "timestamp": entry["time"],
            # Extract channel name and URL from subtitles if present
            "channel_name": entry.get("subtitles", [{}])[0].get("name", "") if "subtitles" in entry and entry["subtitles"] else "",
            "channel_url": entry.get("subtitles", [{}])[0].get("url", "") if "subtitles" in entry and entry["subtitles"] else ""
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
    
    # Find the most rewatched video
    video_counts = (
        df.group_by("url")
        .agg([
            pl.count().alias("rewatch_count"),
            pl.col("title").first().alias("title"),
            pl.col("timestamp").min().alias("first_timestamp")
        ])
        .sort("rewatch_count", descending=True)
    )
    most_rewatched_video = video_counts.head(1)
    most_rewatched_url = most_rewatched_video["url"][0] if not most_rewatched_video.is_empty() else None
    most_rewatched_title = most_rewatched_video["title"][0] if not most_rewatched_video.is_empty() else None
    most_rewatched_timestamp = most_rewatched_video["first_timestamp"][0] if not most_rewatched_video.is_empty() else None
    rewatch_count = most_rewatched_video["rewatch_count"][0] if not most_rewatched_video.is_empty() else 0
    
    # Find the favorite creator (channel with the most videos watched), excluding empty channel_url
    creator_counts = (
        df.filter(pl.col("channel_url") != "")  # Exclude rows with empty channel_url
        .group_by("channel_url")
        .agg([
            pl.count().alias("creator_watch_count"),
            pl.col("channel_name").first().alias("creator_name")
        ])
        .sort("creator_watch_count", descending=True)
    )
    favorite_creator = creator_counts.head(1)
    favorite_creator_url = favorite_creator["channel_url"][0] if not favorite_creator.is_empty() else None
    favorite_creator_name = favorite_creator["creator_name"][0] if not favorite_creator.is_empty() else None
    favorite_creator_watch_count = favorite_creator["creator_watch_count"][0] if not favorite_creator.is_empty() else 0

    # If no creator data is available, set to None/0
    if favorite_creator_url == "":
        favorite_creator_url = None
        favorite_creator_name = None
        favorite_creator_watch_count = 0
    
    # Add first video, most rewatched video, and favorite creator details as columns
    sorted_df = sorted_df.with_columns([
        # First video details
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
          .alias("first_video_timestamp"),
        # Most rewatched video details
        pl.when(pl.col("url") == most_rewatched_url)
          .then(pl.lit(most_rewatched_url))
          .otherwise(pl.lit(None))
          .alias("most_rewatched_url"),
        pl.when(pl.col("url") == most_rewatched_url)
          .then(pl.lit(most_rewatched_title))
          .otherwise(pl.lit(None))
          .alias("most_rewatched_title"),
        pl.when(pl.col("url") == most_rewatched_url)
          .then(pl.lit(most_rewatched_timestamp))
          .otherwise(pl.lit(None))
          .alias("most_rewatched_timestamp"),
        pl.when(pl.col("url") == most_rewatched_url)
          .then(pl.lit(rewatch_count))
          .otherwise(pl.lit(None))
          .alias("rewatch_count"),
        # Favorite creator details
        pl.when(pl.col("channel_url") == favorite_creator_url)
          .then(pl.lit(favorite_creator_url))
          .otherwise(pl.lit(None))
          .alias("favorite_creator_url"),
        pl.when(pl.col("channel_url") == favorite_creator_url)
          .then(pl.lit(favorite_creator_name))
          .otherwise(pl.lit(None))
          .alias("favorite_creator_name"),
        pl.when(pl.col("channel_url") == favorite_creator_url)
          .then(pl.lit(favorite_creator_watch_count))
          .otherwise(pl.lit(None))
          .alias("favorite_creator_watch_count")
    ])
    
    # print("Parsed days of week:", sorted_df["day_of_week"].to_list())
    # print("First video URL:", first_video_url)
    # print("First video title:", first_video_title)
    # print("First video timestamp:", first_video_timestamp)
    # print("Most rewatched video URL:", most_rewatched_url)
    # print("Most rewatched video title:", most_rewatched_title)
    # print("Most rewatched video timestamp:", most_rewatched_timestamp)
    # print("Rewatch count:", rewatch_count)
    # print("Favorite creator name:", favorite_creator_name)
    # print("Favorite creator URL:", favorite_creator_url)
    # print("Favorite creator watch count:", favorite_creator_watch_count)
    # print("DataFrame with video and creator details:", sorted_df)
    return sorted_df