import polars as pl
from typing import Dict

class WordCloudService:
    def calculate(self, search_df: pl.DataFrame, top_n: int = 50) -> Dict[str, int]:
        # Count the frequency of each query
        query_counts = (
            search_df.group_by("query")
            .agg(pl.count().alias("frequency"))
            .sort("frequency", descending=True)
            .head(top_n)  # Limit to top N queries
        )
        
        # Convert to dictionary for word cloud
        word_cloud_data = dict(zip(
            query_counts["query"].to_list(),
            query_counts["frequency"].cast(pl.Int32).to_list()  # Ensure integer counts
        ))
        
        print("Word cloud data:", word_cloud_data)
        return word_cloud_data