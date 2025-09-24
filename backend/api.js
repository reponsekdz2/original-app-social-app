import { Router } from 'express';
import authRouter from './auth.js';
import postsRouter from './posts.js';
import reelsRouter from './reels.js';
import storiesRouter from './stories.js';
import usersRouter from './users.js';
import messagesRouter from './messages.js';
import reportsRouter from './reports.js';
import searchRouter from './search.js';
import miscRouter from './misc.js';
import livestreamsRouter from './livestreams.js';
import adminRouter from './admin.js';
import aiRouter from './ai.js';
import commentsRouter from './comments.js';
import notificationsRouter from './notifications.js';


export default (upload) => {
    const router = Router();
    
    router.use('/auth', authRouter);
    router.use('/posts', postsRouter(upload));
    router.use('/reels', reelsRouter(upload));
    router.use('/stories', storiesRouter(upload));
    router.use('/users', usersRouter);
    router.use('/messages', messagesRouter(upload));
    router.use('/reports', reportsRouter);
    router.use('/search', searchRouter);
    router.use('/misc', miscRouter);
    router.use('/livestreams', livestreamsRouter);
    router.use('/admin', adminRouter(upload));
    router.use('/ai', aiRouter);
    router.use('/comments', commentsRouter);
    router.use('/notifications', notificationsRouter);


    return router;
};
