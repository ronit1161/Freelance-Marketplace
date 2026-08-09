from typing import Optional, Any, Dict
from pydantic import BaseModel, Field


class GigResponse(BaseModel):
    title: str = Field(..., description="Gig title from freelancer perspective", example="I will build a modern React web app")
    description: str = Field(..., description="Detailed description of the service offered")
    price: int = Field(..., description="Estimated price in INR", example=5000)
    deliveryDays: int = Field(..., description="Estimated delivery days", example=3)
    category: str = Field(..., description="Service category", example="Web Development")


class AIResponse(BaseModel):
    success: bool = Field(..., description="Whether the request succeeded")
    content: Optional[str] = Field(None, description="Generated response content from Gemini")
    model: Optional[str] = Field(None, description="Model used for generation")
    raw_response: Optional[Dict[str, Any]] = Field(None, description="Additional response metadata")
    error: Optional[str] = Field(None, description="Error message if execution failed")


class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    service: str = Field(..., example="AI Microservice")
    environment: str = Field(..., example="development")
