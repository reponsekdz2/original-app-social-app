import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// This should be in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// @desc    Generate text suggestions using Gemini
// @route   POST /api/ai/compose
// @access  Private
router.post('/compose', protect, async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Text to compose is required." });
    }
    if (text.length > 1000) {
        return res.status(400).json({ message: "Text is too long. Maximum 1000 characters." });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Rephrase the following user text in three different styles: 1. Witty & Casual, 2. Eloquent & Formal, 3. Expressive & Poetic.

User Text: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['suggestions']
                }
            }
        });

        const suggestions = JSON.parse(response.text);
        res.json(suggestions);

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to generate AI suggestions.' });
    }
});

// @desc    Generate an image for a story using Gemini
// @route   POST /api/ai/generate-story-image
// @access  Private
router.post('/generate-story-image', protect, async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: "A prompt is required." });
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '9:16', // For stories
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64Image = response.generatedImages[0].image.imageBytes;
            res.json({ image: base64Image });
        } else {
            res.status(500).json({ message: "Image generation failed." });
        }
    } catch (error) {
        console.error('Gemini Image Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate AI image.' });
    }
});


export default router;
