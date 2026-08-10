import apiClient from "./apiClient";

/**
 * Generate structured Gig details using AI Service (/api/v1/ai/generate)
 * @param {string} prompt - User description/prompt for AI generation
 * @returns {Promise<Object>} Object containing title, description, price, deliveryDays, category
 */
export const generateGigWithAI = async (prompt) => {
  try {
    const response = await apiClient.post("/api/v1/ai/generate", { prompt });
    // Support both direct JSON object and wrapped ApiResponse structure
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error("AI Generation Error:", error);
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to generate Gig details using AI service. Please ensure AI service is running.";
    throw new Error(message);
  }
};
