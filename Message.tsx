// Fix: Create the Message component.
import React from 'react';
import type { Message, User } from './types';
import Icon from './components/Icon';

interface MessageProps {
    message: Message;
    currentUser: User;
    participants: User[];
    onReply: (message: Message) => void;
    onDelete: (messageId: string) => void;
    onReact: (emoji: string) => void;
}

const MessageComponent: React.FC<MessageProps> = ({ message, currentUser, participants, onReply }) => {
    const isCurrentUser = message.senderId === currentUser.id;
    const sender = participants.find(p => p.id === message.senderId);

    const alignment = isCurrentUser ? 'items-end' : 'items-start';
    const bubbleColor = isCurrentUser ? 'bg-red-600' : 'bg-gray-700';
    const bubbleRadius = isCurrentUser ? 'rounded-l-lg rounded-br-lg' : 'rounded-r-lg rounded-bl-lg';

    return (
        <div className={`flex flex-col ${alignment} group`}>
            <div className="flex items-center">
                 {!isCurrentUser && <img src={sender?.avatar} alt={sender?.username} className="w-6 h-6 rounded-full mr-2" />}
                <div className={`px-3 py-2 ${bubbleColor} ${bubbleRadius} max-w-xs lg:max-w-md`}>
                    <p>{message.content}</p>
                </div>
            </div>
             <p className="text-xs text-gray-500 mt-1 px-2">{message.timestamp}</p>
        </div>
    );
};

export default MessageComponent;
