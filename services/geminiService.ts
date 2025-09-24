
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getComposeSuggestions = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 short, creative, and distinct chat message replies based on the following prompt. Each suggestion should be on a new line and not numbered.\n\nPrompt: "${prompt}"`,
            config: {
                temperature: 0.8,
                maxOutputTokens: 100,
                // Fix: Added thinkingConfig as maxOutputTokens is set. This reserves tokens for the final output.
                thinkingConfig: { thinkingBudget: 25 },
            }
        });

        const text = response.text;
        return text.split('\n').filter(s => s.trim() !== '');

    } catch (error) {
        console.error("Error getting suggestions from Gemini API:", error);
        return ["Sorry, I couldn't think of anything right now."];
    }
};
