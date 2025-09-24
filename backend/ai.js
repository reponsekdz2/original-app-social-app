import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

if (!process.env.API_KEY) {
  console.warn("API_KEY not found in environment variables. AI features will be disabled.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// POST /api/ai/compose
router.post('/compose', isAuthenticated, async (req, res) => {
    if (!ai) {
        return res.status(503).json({ message: "AI service is not configured on the server." });
    }

    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required.' });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 short, creative, and distinct chat message replies based on the following prompt. Each suggestion should be on a new line and not numbered.\n\nPrompt: "${prompt}"`,
            config: {
                temperature: 0.8,
                maxOutputTokens: 100,
            }
        });
        
        const text = response.text;
        const suggestions = text.split('\n').filter(s => s.trim() !== '');
        
        res.json({ suggestions });

    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ message: 'Failed to generate suggestions from AI.' });
    }
});

export default router;
