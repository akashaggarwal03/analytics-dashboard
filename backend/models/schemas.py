from pydantic import BaseModel
from datetime import datetime

class SearchEntry(BaseModel):
    query: str
    timestamp: datetime

class WatchEntry(BaseModel):
    title: str
    url: str
    timestamp: datetime
    channelName: str