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
    return df.with_columns(
        pl.col("timestamp")
        .str.strptime(pl.Datetime, "%Y-%m-%dT%H:%M:%S%.fZ", strict=False)  # Handle optional microseconds
    )