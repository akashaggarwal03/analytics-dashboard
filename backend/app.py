from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard
import uvicorn

app = FastAPI()

# Debug middleware to log requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request received: {request.method} {request.url}")
    print(f"Origin header: {request.headers.get('origin')}")
    response = await call_next(request)
    print(f"Response headers: {dict(response.headers)}")
    return response

# Allow CORS for local development and deployed frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://analytics-dashboard-frontend-3yj3.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the YouTube Analytics Dashboard API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)