
import { Router } from 'express';
import db, { hydrate } from './data.js';

const router = Router();

// --- General Data Endpoints ---

// Get main feed (posts from followed users + stories)
router.get('/feed', (req, res) => {
    // For simplicity, returning all posts. A real feed would be personalized.
    const hydratedPosts = db.posts
        .map(p => hydrate(p, ['user', 'comments']))
        .map(p => {
            p.comments = p.comments.map(c => hydrate(c, ['user']));
            return p;
        });
        
    const hydratedStories = db.stories.map(s => hydrate(s, ['user']));

    res.json({ posts: hydratedPosts, stories: hydratedStories });
});

// Get explore feed (all posts, for now)
router.get('/explore', (req, res) => {
    const hydratedPosts = db.posts.map(p => hydrate(p, ['user']));
    res.json(hydratedPosts);
});

// Get all reels
router.get('/reels', (req, res) => {
    const hydratedReels = db.reels
        .map(r => hydrate(r, ['user', 'comments']))
        .map(r => {
            r.comments = r.comments.map(c => hydrate(c, ['user']));
            return r;
        });
    res.json(hydratedReels);
});

// Get data for the sidebar
router.get('/sidebar', (req, res) => {
    res.json({
        trendingTopics: db.trendingTopics,
        suggestedUsers: db.users.slice(1, 5).map(u => hydrate(u, ['followers', 'following'])),
        feedActivities: db.feedActivities.map(a => hydrate(a, ['user', 'targetUser', 'targetPost'])),
        sponsoredContent: db.sponsoredContent,
        conversations: db.conversations.map(c => hydrate(c, ['participants', 'messages']))
    });
});

router.get('/conversations', (req, res) => {
    const hydrated = db.conversations.map(c => {
        const convo = hydrate(c, ['participants', 'messages']);
        convo.messages = convo.messages.map(m => hydrate(m, [])); // messages have senderId, not sender object
        return convo;
    });
    res.json(hydrated);
});

// Get static content
router.get('/testimonials', (req, res) => res.json(db.testimonials.map(t => hydrate(t, ['user']))));
router.get('/help', (req, res) => res.json(db.helpArticles));
router.get('/support', (req, res) => res.json(db.supportTickets));
router.get('/notifications', (req, res) => res.json(db.notifications.map(n => hydrate(n, ['user', 'post']))));
router.get('/saved', (req, res) => res.json(db.posts.filter(p => p.savedBy.includes('user_0')).map(p => hydrate(p, ['user']))));
router.get('/archive', (req, res) => res.json(db.posts.filter(p => p.user === 'user_0' && p.isArchived).map(p => hydrate(p, ['user']))));


export default router;
