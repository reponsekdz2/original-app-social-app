import { GoogleGenAI } from "@google/genai";

// Ensure the API key is handled securely and not exposed in the client-side code.
// This assumes the build environment replaces `process.env.API_KEY` with the actual key.
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.error("API_KEY environment variable not set. Gemini API calls will be disabled.");
}

export const generateCaption = async (imageAsBase64: string, mimeType: string): Promise<string> => {
  if (!ai) {
    return "API key is not configured. Cannot generate caption.";
  }
  
  try {
    const imagePart = {
      inlineData: {
        data: imageAsBase64,
        mimeType: mimeType,
      },
    };
    
    const textPart = {
      text: "Write a short, engaging caption for this image for a social media post. Make it sound like it's for an Instagram-like platform focused on movies and TV shows called 'Netflixgram'. Keep it under 30 words.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating caption with Gemini API:", error);
    return "Could not generate caption due to an API error.";
  }
};

export const generateStoryImage = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("API key is not configured. Cannot generate image.");
  }

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A vibrant, high-quality photograph for a social media story. Style: cinematic, professional. Prompt: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '9:16',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("API did not return any images.");
    }

  } catch (error) {
    console.error("Error generating story image with Gemini API:", error);
    throw new Error("Could not generate story image due to an API error.");
  }
};
