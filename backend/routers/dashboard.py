from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from concurrent.futures import ThreadPoolExecutor
import asyncio
from repositories.search_history import parse_search_history
from repositories.watch_history import parse_watch_history
from services.peak_time import PeakTimeService
from services.word_cloud import WordCloudService
from configs.settings import settings

router = APIRouter(prefix="/dashboard")
executor = ThreadPoolExecutor(max_workers=settings.MAX_WORKERS)

@router.post("/upload-generate-dashboard")
async def upload_generate_dashboard(search_history: UploadFile, watch_history: UploadFile):
    try:
        search_content = await search_history.read()
        watch_content = await watch_history.read()

        # Process files in parallel using ThreadPoolExecutor
        loop = asyncio.get_event_loop()
        search_task = loop.run_in_executor(executor, parse_search_history, search_content)
        watch_task = loop.run_in_executor(executor, parse_watch_history, watch_content)
        search_df, watch_df = await asyncio.gather(search_task, watch_task)

        # Compute peak times
        peak_service = PeakTimeService()
        peak_times = peak_service.calculate(watch_df)

        # Compute word cloud data
        word_cloud_service = WordCloudService()
        word_cloud_data = word_cloud_service.calculate(search_df)

        # Return the processed data directly in the response
        return JSONResponse(content={
            "peak_times_data": peak_times,
            "word_cloud_data": word_cloud_data,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))