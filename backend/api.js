import { Router } from 'express';
import authRouter from './auth.js';
import usersRouter from './users.js';
import postsRouter from './posts.js';
import reelsRouter from './reels.js';
import storiesRouter from './stories.js';
import messagesRouter from './messages.js';
import notificationsRouter from './notifications.js';
import searchRouter from './search.js';
import miscRouter from './misc.js';
import adminRouter from './admin.js';
import reportsRouter from './reports.js';
import commentsRouter from './comments.js';
import tagsRouter from './tags.js';
import callsRouter from './calls.js';
import livestreamsRouter from './livestreams.js';


export default (upload) => {
    const router = Router();
    
    router.use('/auth', authRouter);
    router.use('/users', usersRouter);
    router.use('/posts', postsRouter(upload));
    router.use('/reels', reelsRouter(upload));
    router.use('/stories', storiesRouter(upload));
    router.use('/messages', messagesRouter(upload));
    router.use('/notifications', notificationsRouter);
    router.use('/search', searchRouter);
    router.use('/misc', miscRouter);
    router.use('/admin', adminRouter(upload));
    router.use('/reports', reportsRouter);
    router.use('/comments', commentsRouter);
    router.use('/tags', tagsRouter);
    router.use('/calls', callsRouter);
    router.use('/livestreams', livestreamsRouter);

    return router;
};