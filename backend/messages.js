import { Router } from 'express';
import db, { generateId, hydrate } from './data.js';

const router = Router();

// Share content as a message
router.post('/share', (req, res) => {
    const { senderId, recipientId, content } = req.body;
    if (!senderId || !recipientId || !content) {
        return res.status(400).json({ message: 'Sender, recipient, and content are required.' });
    }

    // Find if a conversation already exists
    let conversation = db.conversations.find(c => 
        c.participants.includes(senderId) && c.participants.includes(recipientId)
    );

    // If not, create a new one
    if (!conversation) {
        conversation = {
            id: generateId('convo'),
            participants: [senderId, recipientId],
            messages: [],
        };
        db.conversations.unshift(conversation);
    }

    const contentString = `Check this out: Shared a ${(content.video ? 'reel' : 'post')} from @${content.user.username}`;
    
    const newMessage = {
      id: generateId('msg'),
      senderId,
      content: contentString,
      type: 'text', // A real app might have a 'share' type with content payload
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    db.messages.push(newMessage);
    conversation.messages.push(newMessage.id);
    
    // In a real app with proper socket room management, you'd emit to the recipient's room.
    // For now, we'll just broadcast a generic event.
    req.app.get('io').emit('receive_message', { conversationId: conversation.id, message: newMessage });

    res.status(201).json({ message: 'Content shared successfully' });
});

export default router;