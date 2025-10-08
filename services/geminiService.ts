import { GoogleGenAI } from "@google/genai";

// As per coding guidelines, API key is in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a post caption using the Gemini API based on a text description.
 * @param imageDescription A description of the image/post content.
 * @returns A promise that resolves to a generated caption string.
 */
export const generatePostCaption = async (imageDescription: string): Promise<string> => {
  try {
    const prompt = `Write an engaging and creative Instagram caption for a photo described as: "${imageDescription}". Include a few relevant hashtags.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Per coding guidelines, access text directly.
    return response.text;
  } catch (error) {
    console.error("Error generating caption with Gemini:", error);
    throw new Error("Failed to generate caption.");
  }
};
