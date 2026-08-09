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
                    logger.error(f"Failed to initialize Gemini Client: {str(e)}")
            else:
                logger.info("Using smart fallback AI generator (GEMINI_API_KEY not configured or using placeholder)")
                fallback_data = self._generate_fallback_gig(prompt)
                return {
                    "success": True,
                    "data": fallback_data,
                    "model": "fallback-generator",
                    "error": None
                }

        target_model = model_name or settings.default_model

        # Dynamically import SYSTEM_PROMPT so edits in gig_prompt.py are reflected immediately
        from app.prompts import gig_prompt
        current_system_prompt = getattr(gig_prompt, "SYSTEM_PROMPT", SYSTEM_PROMPT)

        final_prompt = f"""
            {current_system_prompt}
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

            # Strip any "I will" prefix from AI generated title
            if gig_data.title:
                gig_data.title = self._sanitize_title(gig_data.title)

            return {
                "success": True,
                "data": gig_data,
                "model": target_model,
                "error": None
            }

        except Exception as e:
            logger.warning(f"Gemini API Call failed ({str(e)}). Falling back to smart generator.")
            fallback_data = self._generate_fallback_gig(prompt)
            return {
                "success": True,
                "data": fallback_data,
                "model": "fallback-generator",
                "error": None
            }

    def _sanitize_title(self, title: str) -> str:
        if not title:
            return title
        cleaned = title.strip()
        lower = cleaned.lower()
        if lower.startswith("i will do "):
            cleaned = cleaned[10:].strip()
        elif lower.startswith("i will "):
            cleaned = cleaned[7:].strip()
        elif lower.startswith("i will"):
            cleaned = cleaned[6:].strip()
        if cleaned:
            cleaned = cleaned[0].upper() + cleaned[1:]
        return cleaned

    def _generate_fallback_gig(self, prompt: str) -> GigResponse:
        prompt_lower = prompt.lower().strip()
        
        # Determine Title cleanly from user prompt without "I will"
        title = self._sanitize_title(prompt)
        if len(title) > 80:
            title = title[:77] + "..."



        # Determine Category, Price, and Delivery Days dynamically from prompt keywords
        category = "Programming & Tech"
        price = 3500
        delivery_days = 3

        if any(w in prompt_lower for w in ["video", "edit", "animation", "motion", "youtube", "adobe", "premiere"]):
            category = "Video & Animation"
            price = 2500
            delivery_days = 2
        elif any(w in prompt_lower for w in ["logo", "design", "ui", "ux", "banner", "graphics", "photoshop", "figma"]):
            category = "Graphics & Design"
            price = 2000
            delivery_days = 2
        elif any(w in prompt_lower for w in ["write", "blog", "content", "article", "translation"]):
            category = "Writing & Translation"
            price = 1500
            delivery_days = 2
        elif any(w in prompt_lower for w in ["full stack", "react", "spring boot", "django", "node", "app", "website", "web"]):
            category = "Full Stack Development"
            price = 5000
            delivery_days = 5
        elif any(w in prompt_lower for w in ["ai", "machine learning", "python", "data"]):
            category = "AI & Machine Learning"
            price = 6000
            delivery_days = 4

        description = (
            f"I am a dedicated professional offering high-quality services for {prompt}. "
            f"I specialize in delivering clean, scalable, and tailored solutions to help achieve your project goals. "
            f"Guaranteed timely delivery, transparent communication, and 100% client satisfaction."
        )

        return GigResponse(
            title=title,
            description=description,
            price=price,
            deliveryDays=delivery_days,
            category=category
        )




# Singleton service instance
gemini_service = GeminiService()
