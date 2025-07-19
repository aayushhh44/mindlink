import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import api from '../api/axios';
import { User, AtSign, Lock } from 'lucide-react';

export default function Profile() {
  const { user, token, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, email, password });
      login(res.data.user, token); // update user in context
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <User className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Update your account details</p>
        </div>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <User className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <AtSign className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="New Password (leave blank to keep current)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
          </div>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          {message && <div className="text-green-600 text-center text-sm">{message}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
} 