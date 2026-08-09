# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, status
from app.models.request import PromptRequest, TaskPromptRequest
from app.models.response import AIResponse, HealthResponse, GigResponse
from app.services.gemini_service import gemini_service
from app.prompt_builder import PromptBuilder
from app.config import settings

router = APIRouter(prefix="/api/v1/ai", tags=["AI Operations"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for AI Microservice."""
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        environment=settings.app_env
    )


@router.post("/generate", response_model=GigResponse)
async def generate_text(request: PromptRequest):
    """Generate structured Gig response for a given prompt using Gemini GenAI."""
    result = gemini_service.generate_content(
        prompt=request.prompt
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result["error"]
        )

    return result["data"]


@router.post("/task", response_model=AIResponse)
async def process_task(request: TaskPromptRequest):
    """Process structured AI domain task (e.g. summarize, proposal_feedback, skill_match, job_description)."""
    formatted_prompt = PromptBuilder.build_task_prompt(
        task_type=request.task_type,
        content=request.content,
        context=request.context
    )

    result = gemini_service.generate_content(
        prompt=formatted_prompt
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result["error"]
        )

    # Convert data back to JSON string or dict for generic AIResponse if needed
    content_str = result["data"].model_dump_json() if result.get("data") else None

    return AIResponse(
        success=True,
        content=content_str,
        model=result["model"]
    )
