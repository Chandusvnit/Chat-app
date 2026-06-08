// frontend/src/components/ChatContainer.jsx
import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuth } from '../context/AuthContext';
import MessageInput from './MessageInput';

const ChatContainer = () => {
  const { messages, selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages, isMessagesLoading } = useChatStore();
  const { authUser, socket } = useAuth();
  const messageEndRef = useRef(null);

  // 1. Core synchronization loop on thread change
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages(socket);
    }
    return () => {
      unsubscribeFromMessages(socket);
    };
  }, [selectedUser?._id, socket, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // 2. Chronological viewport sliding auto-scroller
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return <div className="flex-1 bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">Loading message sync timeline...</div>;
  }

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col h-full overflow-hidden">
      {/* Target User Info Subheader */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
        <img
          src={selectedUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`}
          alt={selectedUser.name}
          className="h-10 w-10 rounded-full object-cover bg-zinc-800"
        />
        <div>
          <h3 className="text-white font-medium text-sm">{selectedUser.name}</h3>
          <p className="text-xs text-zinc-500">{selectedUser.email}</p>
        </div>
      </div>

      {/* Message Feed Display Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isFromMe = msg.sender === authUser._id;
          const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={msg._id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md p-3.5 rounded-2xl relative shadow-md text-sm ${
                  isFromMe ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none'
                }`}
              >
                <p className="pr-10 leading-relaxed break-words">{msg.content}</p>
                <span className="absolute bottom-1 right-2 text-[10px] opacity-60 tracking-tighter">
                  {formattedTime}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Persistent Bottom Controls */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;