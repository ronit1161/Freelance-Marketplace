from contextlib import asynccontextmanager
import logging
# pyrefly: ignore [missing-import]
import uvicorn
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
import py_eureka_client.eureka_client as eureka_client

from app.config import settings
from app.controllers.ai_controller import router as ai_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.eureka_server:
        try:
            await eureka_client.init_async(
                eureka_server=settings.eureka_server,
                app_name=settings.eureka_app_name,
                instance_port=settings.port,
                instance_host=settings.eureka_instance_host
            )
            logger.info(f"Registered {settings.eureka_app_name} with Eureka Server at {settings.eureka_server}")
        except Exception as e:
            logger.warning(f"Eureka registration failed: {e}")
    yield
    try:
        await eureka_client.stop_async()
    except Exception:
        pass


app = FastAPI(
    title=settings.app_name,
    description="Microservice for GenAI functionality powered by Google Gemini and API Keys",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Controller Routers
app.include_router(ai_router)


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "docs": "/docs",
        "health": "/api/v1/ai/health"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=(settings.app_env == "development")
    )


