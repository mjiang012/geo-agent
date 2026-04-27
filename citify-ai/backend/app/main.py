from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api.v1 import monitor, analyze, optimize, generate

# Initialize FastAPI app
app = FastAPI(
    title="Citify AI API",
    description="Citify AI - GEO (Generate-Enhance-Optimize) Workflow Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(monitor.router, prefix="/api/v1/monitor", tags=["monitor"])
app.include_router(analyze.router, prefix="/api/v1/analyze", tags=["analyze"])
app.include_router(optimize.router, prefix="/api/v1/optimize", tags=["optimize"])
app.include_router(generate.router, prefix="/api/v1/generate", tags=["generate"])


@app.get("/")
async def root():
    return {
        "name": "Citify AI API",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG
    )
