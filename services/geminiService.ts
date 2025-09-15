import { GoogleGenAI } from "@google/genai";

// Guideline: Always use new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a caption for an image using the Gemini API.
 * @param base64Data The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to the generated caption string.
 */
export const generateCaption = async (base64Data: string, mimeType: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };

  const textPart = {
    text: "Write a short, engaging caption for this image for a social media post on a platform like Instagram. Be creative and descriptive.",
  };

  // Guideline: Use ai.models.generateContent
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Guideline: Use 'gemini-2.5-flash' for general text tasks
    contents: { parts: [imagePart, textPart] },
  });

  // Guideline: Use response.text to get the text output
  return response.text.trim();
};

/**
 * Generates an image for a story using the Gemini API.
 * @param prompt The text prompt to generate the image from.
 * @returns A promise that resolves to the base64 encoded image data.
 */
export const generateStoryImage = async (prompt: string): Promise<string> => {
  // Guideline: Use ai.models.generateImages for image generation
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001', // Guideline: Use 'imagen-4.0-generate-001' for image generation
    prompt: `${prompt}, cinematic, vertical aspect ratio for a mobile story`,
    config: {
      numberOfImages: 1,
      aspectRatio: '9:16', // Stories are vertical
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  } else {
    throw new Error("Image generation failed, no images returned.");
  }
};

/**
 * Generates a comment suggestion based on a post caption and a desired style.
 * @param postCaption The caption of the post to comment on.
 * @param style The desired style of the comment (e.g., 'Witty', 'Formal').
 * @returns A promise that resolves to the generated comment string.
 */
export const generateComment = async (postCaption: string, style: string): Promise<string> => {
  const prompt = `You are a social media assistant. Based on the following post caption, generate a short, one-sentence comment with a ${style} tone. Do not use hashtags.
  
Post Caption: "${postCaption}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text.trim().replace(/"/g, ''); // Remove quotes from the response
};
