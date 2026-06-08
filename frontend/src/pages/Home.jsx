// frontend/src/pages/Home.jsx
import { useChatStore } from '../store/useChatStore';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import { MessageSquare, LogOut } from 'lucide-react';

const Home = () => {
  const { selectedUser } = useChatStore();
  const { logout, authUser } = useAuth();

  return (
    <div className="h-screen bg-zinc-950 flex flex-col font-sans overflow-hidden">
      
      {/* Top Application Ribbon Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-violet-500">
          <MessageSquare className="h-6 w-6" />
          <span className="text-white font-bold text-base tracking-tight">SignalFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400 font-medium bg-zinc-950 px-3 py-1.5 border border-zinc-800 rounded-lg">
            User: {authUser?.name}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 hover:text-red-400 font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        {selectedUser ? (
          <ChatContainer />
        ) : (
          /* Landing/Empty Display State Box */
          <div className="flex-1 bg-zinc-950 flex flex-col items-center justify-center text-center p-8">
            <div className="rounded-2xl bg-violet-600/5 p-4 text-violet-500 mb-4 animate-pulse">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h3 className="text-white text-lg font-bold mb-1">No Chat Open</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
              Select an active partner thread from the sidebar list to resume messaging.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;