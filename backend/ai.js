
import { Router } from 'express';
import { GoogleGenAI } from "@google/genai";

const router = Router();

// This is a placeholder for the API key. In a real production environment,
// this should be loaded securely from environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const handleAIRequest = async (res, errorMessage, logic) => {
    if (!API_KEY) {
        return res.status(503).json({ message: "AI Service is not configured." });
    }
    try {
        await logic();
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        res.status(500).json({ message: errorMessage });
    }
};

// Generate Caption
router.post('/generate-caption', async (req, res) => {
    const { base64Data, mimeType } = req.body;
    if (!base64Data || !mimeType) return res.status(400).json({ message: "Missing image data" });

    await handleAIRequest(res, "Failed to generate caption", async () => {
        const imagePart = { inlineData: { data: base64Data, mimeType } };
        const textPart = { text: "Write a short, engaging caption for this image for a social media post on a platform like Instagram. Be creative and descriptive." };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        res.json({ caption: response.text.trim() });
    });
});

// Generate Story Image
router.post('/generate-story-image', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Missing prompt" });

    await handleAIRequest(res, "Failed to generate story image", async () => {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${prompt}, cinematic, vertical aspect ratio for a mobile story`,
            config: {
                numberOfImages: 1,
                aspectRatio: '9:16',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            res.json({ imageB64: response.generatedImages[0].image.imageBytes });
        } else {
            throw new Error("Image generation returned no images.");
        }
    });
});

// Generate Comment
router.post('/generate-comment', async (req, res) => {
    const { postCaption, style } = req.body;
    if (!postCaption || !style) return res.status(400).json({ message: "Missing post caption or style" });
    
    await handleAIRequest(res, "Failed to generate comment", async () => {
        const prompt = `You are a social media assistant. Based on the following post caption, generate a short, one-sentence comment with a ${style} tone. Do not use hashtags.\n\nPost Caption: "${postCaption}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ comment: response.text.trim().replace(/"/g, '') });
    });
});

// Generate Bio
router.post('/generate-bio', async (req, res) => {
    const { username, name } = req.body;
    if (!username || !name) return res.status(400).json({ message: "Missing username or name" });

    await handleAIRequest(res, "Failed to generate bio", async () => {
        const prompt = `Generate a short, creative, and engaging bio for a social media profile. The bio should be under 150 characters.\n\nUsername: ${username}\nName: ${name}\n\nBio:`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ bio: response.text.trim() });
    });
});

export default router;
