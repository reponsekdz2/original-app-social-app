import { Router } from 'express';
import db, { hydrate } from './data.js';

const router = Router();

const findComment = (id, res) => {
    const comment = db.comments.find(c => c.id === id);
    if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return null;
    }
    return comment;
};

// Toggle Like on a Comment
router.post('/:id/toggle-like', (req, res) => {
    const comment = findComment(req.params.id, res);
    if (!comment) return;

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const likeIndex = comment.likedBy.indexOf(userId);
    if (likeIndex > -1) {
        comment.likedBy.splice(likeIndex, 1);
    } else {
        comment.likedBy.push(userId);
    }
    comment.likes = comment.likedBy.length;
    
    // Find the parent post/reel and emit an update event
    const parentPost = db.posts.find(p => p.comments.includes(comment.id));
    const parentReel = db.reels.find(r => r.comments.includes(comment.id));
    
    if (parentPost) {
        const hydratedPost = hydrate(parentPost, ['user', 'comments', 'likedBy', 'savedBy']);
        hydratedPost.comments = hydratedPost.comments.map(c => hydrate(c, ['user', 'likedBy']));
        req.app.get('io').emit('post_updated', hydratedPost);
    }
    
    if (parentReel) {
        const hydratedReel = hydrate(parentReel, ['user', 'comments', 'likedBy']);
        hydratedReel.comments = hydratedReel.comments.map(c => hydrate(c, ['user', 'likedBy']));
        req.app.get('io').emit('reel_updated', hydratedReel);
    }
    
    res.json(hydrate(comment, ['user', 'likedBy']));
});

export default router;