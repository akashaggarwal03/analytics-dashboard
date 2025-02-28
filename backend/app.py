from fastapi import FastAPI, UploadFile

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "YouTube Analytics Dashboard Backend"}

@app.post("/upload-generate-dashboard")
async def upload_generate_dashboard(search_history: UploadFile, watch_history: UploadFile):
    return {"status": "Files received", "search_filename": search_history.filename, "watch_filename": watch_history.filename}