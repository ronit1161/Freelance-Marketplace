from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str
class TaskPromptRequest(BaseModel):
    task_type: str = Field(..., description="Type of task: e.g., 'summarize', 'generate_proposal', 'skill_match'", example="summarize")
    content: str = Field(..., description="Main text or content to process")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context parameters")
    system_instruction: Optional[str] = Field(None, description="Optional custom system role prompt")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
