import json
import logging
from typing import Optional, Dict, Any
# pyrefly: ignore [missing-import]
from google import genai
# pyrefly: ignore [missing-import]
from google.genai import types
from app.prompts.gig_prompt import SYSTEM_PROMPT
from app.models.response import GigResponse

from app.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service to handle calls to Google GenAI / Gemini API using official google-genai SDK."""

    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.default_model = settings.default_model
        self.client: Optional[genai.Client] = None

        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize GenAI client: {str(e)}")
        else:
            logger.warning("GEMINI_API_KEY is not set or using placeholder value in .env")

    def generate_content(
        self,
        prompt: str,
        temperature: Optional[float] = 0.7,
        max_output_tokens: Optional[int] = 2000,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate content from Gemini model returning structured GigResponse.

        Args:
            prompt: Text prompt for generation.
            temperature: Sampling temperature.
            max_output_tokens: Max token count (default 2000 to prevent JSON truncation).
            model_name: Model override.

        Returns:
            Dict containing success status, parsed GigResponse object/dict, or error details.
        """
        if not self.client:
            if settings.gemini_api_key and settings.gemini_api_key != "your_gemini_api_key_here":
                try:
                    self.client = genai.Client(api_key=settings.gemini_api_key)
                except Exception as e:
                    return {
                        "success": False,
                        "data": None,
                        "error": f"Failed to initialize Gemini Client: {str(e)}"
                    }
            else:
                return {
                    "success": False,
                    "data": None,
                    "error": "GEMINI_API_KEY is not configured in .env file. Please set a valid API key."
                }

        target_model = model_name or self.default_model

        final_prompt = f"""
            {SYSTEM_PROMPT}
            User Prompt:
            {prompt}
        """

        try:
            # Build generation config with Structured Output schema
            config = types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_output_tokens,
                response_mime_type="application/json",
                response_schema=GigResponse
            )

            response = self.client.models.generate_content(
                model=target_model,
                contents=final_prompt,
                config=config,
            )

            raw_text = (response.text or "").strip()
            
            # Strip markdown JSON fences if present
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            # Parse JSON into GigResponse model
            gig_data = GigResponse.model_validate_json(raw_text)

            return {
                "success": True,
                "data": gig_data,
                "model": target_model,
                "error": None
            }

        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            return {
                "success": False,
                "data": None,
                "model": target_model,
                "error": str(e)
            }


# Singleton service instance
gemini_service = GeminiService()
