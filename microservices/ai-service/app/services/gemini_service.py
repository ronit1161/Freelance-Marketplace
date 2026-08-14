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
    """Service to handle calls to Google GenAI / Gemini API with intelligent fallback generator."""

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
        """Generate content from Gemini model returning structured GigResponse with smart fallback."""
        if not self.client:
            if settings.gemini_api_key and settings.gemini_api_key != "your_gemini_api_key_here":
                try:
                    self.client = genai.Client(api_key=settings.gemini_api_key)
                except Exception as e:
                    logger.error(f"Failed to initialize Gemini Client: {str(e)}")
            else:
                fallback_data = self._generate_fallback_gig(prompt)
                return {
                    "success": True,
                    "data": fallback_data,
                    "model": "fallback-generator",
                    "error": None
                }

        target_model = model_name or settings.default_model

        from app.prompts import gig_prompt
        current_system_prompt = getattr(gig_prompt, "SYSTEM_PROMPT", SYSTEM_PROMPT)

        final_prompt = f"""
            {current_system_prompt}
            User Prompt:
            {prompt}
        """

        try:
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
            
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            gig_data = GigResponse.model_validate_json(raw_text)

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
        
        prefixes_to_strip = [
            "i want to offer a service for ",
            "i want to offer service for ",
            "i want to offer a service creating ",
            "i want to offer service creating ",
            "i want to offer a service to ",
            "i want to offer service to ",
            "i want to offer a ",
            "i want to offer an ",
            "i want to offer ",
            "i want to create a ",
            "i want to create an ",
            "i want to create ",
            "i want to build a ",
            "i want to build an ",
            "i want to build ",
            "i want to do ",
            "i will provide a ",
            "i will provide an ",
            "i will provide ",
            "i will create a ",
            "i will create an ",
            "i will create ",
            "i will build a ",
            "i will build an ",
            "i will build ",
            "i will do ",
            "i will ",
            "i can create a ",
            "i can create an ",
            "i can create ",
            "i can build a ",
            "i can build an ",
            "i can build ",
            "i can do ",
            "i can ",
            "i provide a ",
            "i provide an ",
            "i provide ",
            "i offer a ",
            "i offer an ",
            "i offer "
        ]
        
        lower = cleaned.lower()
        for prefix in prefixes_to_strip:
            if lower.startswith(prefix):
                cleaned = cleaned[len(prefix):].strip()
                break

        if cleaned:
            cleaned = cleaned[0].upper() + cleaned[1:]
        return cleaned

    def _generate_fallback_gig(self, prompt: str) -> GigResponse:
        prompt_lower = prompt.lower().strip()
        cleaned_topic = self._sanitize_title(prompt)

        # 1. Video & Animation
        if any(w in prompt_lower for w in ["video", "edit", "animation", "motion", "youtube", "premiere", "after effects", "reel", "tiktok"]):
            return GigResponse(
                title="Professional Video Editing & Motion Graphics for YouTube & Social Media",
                description=(
                    "I specialize in professional video editing, color grading, sound design, and dynamic motion graphics. "
                    "Using Adobe Premiere Pro and After Effects, I turn your raw footage into engaging, high-retention content "
                    "for YouTube, Instagram Reels, TikTok, and corporate promos. Includes 4K rendering, seamless transitions, and 100% satisfaction."
                ),
                price=2500,
                deliveryDays=2,
                category="Video & Animation"
            )

        # 2. Graphics & Design
        elif any(w in prompt_lower for w in ["logo", "design", "ui", "ux", "banner", "graphics", "photoshop", "figma", "illustrator", "branding"]):
            return GigResponse(
                title="Modern Brand Logo Design & High-Converting UI/UX Design",
                description=(
                    "I specialize in crafting modern, memorable brand logos and clean UI/UX designs that elevate your brand identity. "
                    "Working in Figma and Adobe Illustrator, I deliver pixel-perfect vector files, responsive layouts, style guides, "
                    "and full commercial usage rights tailored to your target audience."
                ),
                price=2000,
                deliveryDays=2,
                category="Graphics & Design"
            )

        # 3. Full Stack / Web Development
        elif any(w in prompt_lower for w in ["full stack", "react", "spring boot", "django", "node", "app", "website", "web", "frontend", "backend", "nextjs"]):
            return GigResponse(
                title="Modern Responsive Web Application Development with React & Spring Boot",
                description=(
                    "I specialize in developing high-performance, responsive full-stack web applications tailored to your business needs. "
                    "Using React, Spring Boot, REST APIs, Tailwind CSS, and MySQL, I build clean component architectures with secure authentication, "
                    "database integration, robust error handling, and scalable code."
                ),
                price=5000,
                deliveryDays=4,
                category="Programming & Tech"
            )

        # 4. AI & Machine Learning
        elif any(w in prompt_lower for w in ["ai", "machine learning", "python", "data", "ml", "deep learning", "nlp", "chatbot"]):
            return GigResponse(
                title="Custom AI, Machine Learning & Automation Script Development in Python",
                description=(
                    "I specialize in building intelligent AI solutions, machine learning models, and automated data workflows using Python, "
                    "FastAPI, TensorFlow, and Scikit-Learn. I deliver clean, documented code with seamless API integration and high predictive accuracy."
                ),
                price=6000,
                deliveryDays=4,
                category="AI & Machine Learning"
            )

        # 5. Writing & Translation
        elif any(w in prompt_lower for w in ["write", "blog", "content", "article", "translation", "copywriting", "seo article"]):
            return GigResponse(
                title="SEO-Optimized Blog Posts, Articles & Professional Copywriting",
                description=(
                    "I provide compelling, well-researched, and SEO-optimized content writing tailored to engage your audience and rank higher on Google. "
                    "Guaranteed 100% original, plagiarism-free articles with clear formatting, keyword research, and prompt delivery."
                ),
                price=1500,
                deliveryDays=2,
                category="Writing & Translation"
            )

        # General Fallback
        title = f"Professional {cleaned_topic} Service" if cleaned_topic else "Professional Freelance Service"
        if len(title) > 80:
            title = title[:77] + "..."

        description = (
            f"I specialize in delivering high-quality, professional solutions for {cleaned_topic}. "
            f"I focus on clean execution, scalable architecture, transparent communication, and on-time delivery "
            f"to ensure 100% client satisfaction on every project."
        )

        return GigResponse(
            title=title,
            description=description,
            price=3500,
            deliveryDays=3,
            category="Programming & Tech"
        )


# Singleton service instance
gemini_service = GeminiService()
