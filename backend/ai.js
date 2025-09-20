import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
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
        const prompt = `You are a creative writing assistant for a social media app. Rephrase the following user text in three different styles: 1. Witty & Casual, 2. Eloquent & Formal, 3. Expressive & Poetic. Return the result as a JSON object with a single key "suggestions" which is an array of these three strings.
        
        User Text: "${text}"
        
        JSON Response:`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const rawJson = response.text.trim().replace(/```json|```/g, '');
        const suggestions = JSON.parse(rawJson);
        
        res.json(suggestions);

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to generate AI suggestions.' });
    }
});

export default router;