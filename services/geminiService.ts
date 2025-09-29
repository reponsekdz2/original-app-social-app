import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// FIX: Initialize Gemini AI client according to guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative caption for a post.
 * @param imageDescription A description of the image(s) in the post.
 * @returns A promise that resolves to a generated caption string.
 */
export async function generatePostCaption(imageDescription: string): Promise<string> {
  const prompt = `Write an engaging and creative Instagram caption for a post with the following description: "${imageDescription}". Keep it short and engaging. Include a few relevant hashtags.`;
  
  try {
    // FIX: Use the correct method to generate content.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    // FIX: Use .text property to extract the response text.
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    // Provide a fallback or re-throw the error for the caller to handle.
    throw new Error("Failed to generate caption.");
  }
}
