// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Lock } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(formData.email, formData.password);
    
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
        
        {/* Header Icon & Brand */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-xl bg-violet-600/10 p-3 text-violet-500">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-zinc-400">Sign in to resume your conversations</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-zinc-500" />
              <input
                type="email"
                required
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none transition-colors"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-zinc-500" />
              <input
                type="password"
                required
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-lg bg-violet-600 py-2.5 font-medium text-white hover:bg-violet-700 focus:outline-none disabled:opacity-50 transition-colors text-sm mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-500 hover:underline">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;