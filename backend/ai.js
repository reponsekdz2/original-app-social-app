import { Router } from 'express';
import { protect } from './middleware/authMiddleware.js';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// This middleware checks if the user is authenticated AND has a premium subscription.
const premiumProtect = (req, res, next) => {
    if (req.user && req.user.is_premium) {
        next();
    } else {
        res.status(403).json({ message: 'This feature is for premium members only.' });
    }
};

// @desc    Rewrite text using AI in a specific style
// @route   POST /api/ai/compose
// @access  Private (Premium Only)
router.post('/compose', protect, premiumProtect, async (req, res) => {
    const { text, style } = req.body;

    if (!text || !style) {
        return res.status(400).json({ message: 'Text and style are required.' });
    }
    
    if (!process.env.API_KEY) {
        console.error('Gemini API key is not set in environment variables.');
        return res.status(500).json({ message: 'AI service is not configured.' });
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `Rewrite the following text in a ${style} tone. Only return the rewritten text, without any preamble or explanation:\n\n"${text}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const composedText = response.text.trim();
        
        res.json({ composedText });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to generate text from AI service.' });
    }
});

export default router;
