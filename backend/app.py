from fastapi import FastAPI
from routers import dashboard
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="YouTube Analytics Dashboard")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {"message": "YouTube Analytics Dashboard Backend"}