from typing import Dict, Any, Optional


class PromptBuilder:
    """Utility builder to format structured prompt templates for AI tasks."""

    @staticmethod
    def build_task_prompt(task_type: str, content: str, context: Optional[Dict[str, Any]] = None) -> str:
        context = context or {}
        
        if task_type == "summarize":
            max_length = context.get("max_words", 100)
            return f"Please summarize the following text in under {max_length} words:\n\n{content}"

        elif task_type == "job_description":
            title = context.get("title", "Project")
            skills = ", ".join(context.get("skills", []))
            return (
                f"Create a professional freelance job post for a project titled '{title}'.\n"
                f"Required Skills: {skills}\n"
                f"Details:\n{content}"
            )

        elif task_type == "proposal_feedback":
            job_requirements = context.get("job_requirements", "N/A")
            return (
                f"Analyze the following proposal against the job requirements.\n"
                f"Job Requirements:\n{job_requirements}\n\n"
                f"Candidate Proposal:\n{content}\n\n"
                f"Provide 3 key strengths and 2 areas for improvement."
            )

        elif task_type == "skill_match":
            job_skills = context.get("job_skills", [])
            freelancer_skills = context.get("freelancer_skills", [])
            return (
                f"Evaluate the skill match between the job requirements and freelancer profile.\n"
                f"Required Job Skills: {job_skills}\n"
                f"Freelancer Skills: {freelancer_skills}\n"
                f"Additional Context:\n{content}\n\n"
                f"Provide a match percentage score (0-100%) and brief justification."
            )

        # Default fallback template
        return f"Task [{task_type}]: {content}"

    @staticmethod
    def default_system_instruction() -> str:
        return "You are a helpful, professional AI assistant integrated into a microservice platform. Be clear, precise, and structured in your answers."
