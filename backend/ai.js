import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// Initialize the Google AI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

/**
 * Generates multiple caption suggestions for a post based on an image.
 * @param {string} base64Image The base64 encoded string of the image.
 * @param {string} mimeType The MIME type of the image.
 * @returns {Promise<string[]>} A promise that resolves to an array of generated caption strings.
 */
const generateCaptionSuggestionsFromImage = async (base64Image, mimeType) => {
  const prompt = "Write 3 engaging and creative Instagram caption ideas for this image. Keep each suggestion to one or two sentences and include a few relevant hashtags. Separate each suggestion with '---'.";
  
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    const captionText = response.text;
    // Split the response into multiple suggestions based on the separator
    return captionText.split('---').map(s => s.trim()).filter(Boolean);
  } catch (error) {
    console.error("Error generating caption from image with Gemini on backend:", error);
    throw new Error("Failed to generate caption from image.");
  }
};

export default (upload) => {
    // This endpoint handles the image upload and calls the Gemini API
    router.post('/generate-caption-from-image', upload.single('image'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }
        try {
            const base64Image = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            const suggestions = await generateCaptionSuggestionsFromImage(base64Image, mimeType);
            res.json({ suggestions });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};
