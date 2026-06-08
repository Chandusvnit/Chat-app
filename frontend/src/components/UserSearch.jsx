import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Search, Loader2 } from "lucide-react";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const { searchUsers, searchResults, isSearching, setSelectedUser, clearSearch } = useChatStore();

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers(query);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery("");
    clearSearch();
  };

  return (
    <div className="p-3 border-b border-zinc-800 relative">
      <form onSubmit={handleSearch} className="flex gap-2 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Find users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <button 
          type="submit" 
          disabled={isSearching || !query.trim()}
          className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[3rem]"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go"}
        </button>
      </form>

      {/* Dropdown Results */}
      {searchResults.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 mx-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
          {searchResults.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="p-3 hover:bg-zinc-700 cursor-pointer flex items-center gap-3 border-b border-zinc-700/50 last:border-0 transition-colors"
            >
              <img
                src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-zinc-900 object-cover"
              />
              <span className="text-sm font-medium text-zinc-200">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;