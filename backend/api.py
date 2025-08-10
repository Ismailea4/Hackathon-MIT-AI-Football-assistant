from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json
import os

app = FastAPI(title="Soccer Match Stats API", version="1.0")

STATS_FILE = "stats_latest.json"


@app.get("/")
def root():
    return {
        "message": "Soccer Match Stats API",
        "endpoints": {
            "/stats": "Get the latest match statistics",
            "/health": "Check API health"
        }
    }


@app.get("/health")
def health_check():
    """Check API status."""
    return {"status": "ok"}


@app.get("/stats")
def get_stats():
    """Return the latest soccer match statistics."""
    if not os.path.exists(STATS_FILE):
        return JSONResponse(
            content={"error": "Stats file not found"},
            status_code=404
        )

    try:
        with open(STATS_FILE, "r", encoding="utf-8") as f:
            stats = json.load(f)
        return stats
    except json.JSONDecodeError:
        return JSONResponse(
            content={"error": "Stats file is corrupted"},
            status_code=500
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)