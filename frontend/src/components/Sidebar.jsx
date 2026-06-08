import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuth } from '../context/AuthContext';
import { Users } from 'lucide-react';
import UserSearch from './UserSearch';

const Sidebar = () => {
  // Pull users and getUsers from store now
  const { selectedUser, setSelectedUser, users, getUsers, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuth();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return <div className="w-80 border-r border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-500 text-sm">Loading contacts...</div>;
  }

  return (
    <aside className="h-full w-80 border-r border-zinc-800 bg-zinc-900 flex flex-col relative">
      {/* Header section */}
      <div className="border-b border-zinc-800 p-5 flex items-center gap-3">
        <Users className="h-6 w-6 text-violet-500" />
        <span className="font-medium text-lg text-white">Contacts</span>
      </div>

      {/* NEW: Search Bar injected here */}
      <UserSearch />

      {/* Directory mapping */}
      <div className="overflow-y-auto flex-1 py-2 px-3 space-y-1">
        {users.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm mt-8">No recent interactions found</div>
        ) : (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-violet-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                <div className="relative">
                  <img
                    src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="h-11 w-11 rounded-full object-cover border border-zinc-700 bg-zinc-800"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-medium truncate text-sm">{user.name}</h4>
                  <p className={`text-xs truncate ${isSelected ? 'text-violet-200' : 'text-zinc-500'}`}>
                    {isOnline ? 'online' : 'offline'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;