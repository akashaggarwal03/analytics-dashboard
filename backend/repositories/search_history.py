import json
import polars as pl
from models.schemas import SearchEntry

def parse_search_history(content: bytes) -> pl.DataFrame:
    data = json.loads(content)
    searches = [
        {
            "query": entry["title"].replace("Searched for ", ""),
            "timestamp": entry["time"]
        }
        for entry in data
        if "title" in entry and "Searched for " in entry["title"]
    ]
    df = pl.DataFrame(searches)
    return df.with_columns(
        pl.col("timestamp")
        .str.strptime(pl.Datetime, "%Y-%m-%dT%H:%M:%S%.fZ", strict=False)  # Handle optional microsecondsß
    )