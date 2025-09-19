
import { Router } from 'express';
import db, { generateId, hydrate } from './data.js';

const router = Router();

const findPost = (id, res) => {
    const post = db.posts.find(p => p.id === id);
    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return null;
    }
    return post;
};

const fullHydratePost = (post) => {
    if (!post) return null;
    const hydratedPost = hydrate(post, ['user', 'comments', 'likedBy', 'savedBy']);
    hydratedPost.comments = hydratedPost.comments.map(c => hydrate(c, ['user', 'likedBy']));
    return hydratedPost;
};

// Toggle Like on a Post
router.post('/:id/toggle-like', (req, res) => {
    const post = findPost(req.params.id, res);
    if (!post) return;

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const likeIndex = post.likedBy.indexOf(userId);
    if (likeIndex > -1) {
        post.likedBy.splice(likeIndex, 1);
    } else {
        post.likedBy.push(userId);
    }
    post.likes = post.likedBy.length;
    
    const finalPost = fullHydratePost(post);
    req.app.get('io').emit('post_updated', finalPost);
    res.json(finalPost);
});

// Toggle Save on a Post
router.post('/:id/toggle-save', (req, res) => {
    const post = findPost(req.params.id, res);
    if (!post) return;
    
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    
    const saveIndex = post.savedBy.indexOf(userId);
    if (saveIndex > -1) {
        post.savedBy.splice(saveIndex, 1);
    } else {
        post.savedBy.push(userId);
    }
    
    const finalPost = fullHydratePost(post);
    req.app.get('io').emit('post_updated', finalPost);
    res.json(finalPost);
});

// Add a comment to a Post
router.post('/:id/comments', (req, res) => {
    const post = findPost(req.params.id, res);
    if (!post) return;
    
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
    post.comments.push(newComment.id);
    
    const finalPost = fullHydratePost(post);
    req.app.get('io').emit('post_updated', finalPost);
    res.status(201).json(finalPost);
});

// Create a new Post
router.post('/', (req, res) => {
    const { userId, media, caption, location } = req.body;
    if (!userId || !media) return res.status(400).json({ message: "User and media are required" });

    const newPost = {
        id: generateId('post'),
        user: userId,
        media: media.map((m, i) => ({ ...m, id: generateId('media') })),
        caption,
        location,
        likes: 0,
        likedBy: [],
        comments: [],
        savedBy: [],
        timestamp: 'now',
    };
    db.posts.unshift(newPost);
    
    const finalPost = fullHydratePost(newPost);
    req.app.get('io').emit('new_post', finalPost); // Let clients know a new post is available
    res.status(201).json(finalPost);
});

// Edit a Post
router.put('/:id', (req, res) => {
    const post = findPost(req.params.id, res);
    if (!post) return;

    const { caption, location } = req.body;
    post.caption = caption ?? post.caption;
    post.location = location ?? post.location;

    const finalPost = fullHydratePost(post);
    req.app.get('io').emit('post_updated', finalPost);
    res.json(finalPost);
});

// Delete a Post
router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });

    db.posts.splice(postIndex, 1);
    
    req.app.get('io').emit('post_deleted', { postId });
    res.status(204).send();
});

// Toggle Archive status of a Post
router.post('/:id/toggle-archive', (req, res) => {
    const post = findPost(req.params.id, res);
    if (!post) return;
    
    post.isArchived = !post.isArchived;

    const finalPost = fullHydratePost(post);
    // This might be a private event for the user, but for now we broadcast
    req.app.get('io').emit('post_updated', finalPost);
    res.json(finalPost);
});


export default router;
