import { Router } from 'express';
import db, { generateId, hydrate } from './data.js';

const router = Router();

const findReel = (id, res) => {
    const reel = db.reels.find(r => r.id === id);
    if (!reel) {
        res.status(404).json({ message: 'Reel not found' });
        return null;
    }
    return reel;
};

const fullHydrateReel = (reel) => {
    if (!reel) return null;
    const hydratedReel = hydrate(reel, ['user', 'comments', 'likedBy']);
    hydratedReel.comments = hydratedReel.comments.map(c => hydrate(c, ['user', 'likedBy']));
    return hydratedReel;
};

// Toggle Like on a Reel
router.post('/:id/toggle-like', (req, res) => {
    const reel = findReel(req.params.id, res);
    if (!reel) return;

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const likeIndex = reel.likedBy.indexOf(userId);
    if (likeIndex > -1) {
        reel.likedBy.splice(likeIndex, 1);
    } else {
        reel.likedBy.push(userId);
    }
    reel.likes = reel.likedBy.length;
    
    const finalReel = fullHydrateReel(reel);
    req.app.get('io').emit('reel_updated', finalReel);
    res.json(finalReel);
});

// Add a comment to a Reel
router.post('/:id/comments', (req, res) => {
    const reel = findReel(req.params.id, res);
    if (!reel) return;
    
    const { userId, text } = req.body;
    if (!userId || !text) return res.status(400).json({ message: 'User ID and text are required' });
    
    const newComment = {
        id: generateId('comment'),
        user: userId,
        text,
        timestamp: 'now',
        likes: 0,
        likedBy: [],
    };
    db.comments.push(newComment);
    reel.comments.push(newComment.id);
    
    const finalReel = fullHydrateReel(reel);
    req.app.get('io').emit('reel_updated', finalReel);
    res.status(201).json(finalReel);
});

export default router;