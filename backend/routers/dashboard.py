from fastapi import APIRouter, UploadFile, WebSocket
from concurrent.futures import ThreadPoolExecutor
import asyncio
from repositories.search_history import parse_search_history
from repositories.watch_history import parse_watch_history
from services.peak_time import PeakTimeService
from utils.websocket import broadcast_data
from configs.settings import settings

router = APIRouter(prefix="/dashboard")
executor = ThreadPoolExecutor(max_workers=settings.MAX_WORKERS)
connected_clients = set()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        connected_clients.remove(websocket)

@router.post("/upload-generate-dashboard")
async def upload_generate_dashboard(search_history: UploadFile, watch_history: UploadFile):
    try:
        search_content = await search_history.read()
        watch_content = await watch_history.read()

        # Parallel parsing
        loop = asyncio.get_event_loop()
        search_task = loop.run_in_executor(executor, parse_search_history, search_content)
        watch_task = loop.run_in_executor(executor, parse_watch_history, watch_content)
        search_df, watch_df = await asyncio.gather(search_task, watch_task)

        # Process features incrementally
        peak_service = PeakTimeService()
        peak_times = peak_service.calculate(watch_df)
        await broadcast_data({"type": "peak_times", "data": peak_times})

        return {"status": "Processing started, check WebSocket for updates"}
    except Exception as e:
        return {"error": str(e)}, 500