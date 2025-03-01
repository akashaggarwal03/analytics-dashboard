from fastapi import FastAPI
from routers import dashboard
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="YouTube Analytics Dashboard")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://analytics-dashboard-frontend-4ath4i9nc.vercel.app/"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {"message": "YouTube Analytics Dashboard Backend"}

# Vercel serverless handler
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)