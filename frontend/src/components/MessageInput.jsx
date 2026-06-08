// frontend/src/components/MessageInput.jsx
import { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Send } from 'lucide-react';

const MessageInput = () => {
  const [text, setText] = useState('');
  const { sendMessage } = useChatStore();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await sendMessage({ content: text.trim() });
    setText('');
  };

  return (
    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none transition-colors"
          placeholder="Type your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
