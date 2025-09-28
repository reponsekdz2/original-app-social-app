import { GoogleGenAI } from "@google/genai";

// Ensure the API key is being loaded from environment variables
if (!process.env.API_KEY) {
  // In a real app, you might want to handle this more gracefully
  console.error("API_KEY environment variable not set!");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateText = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    throw new Error("Failed to generate text from AI service.");
  }
};

// Add other Gemini service functions as needed...
