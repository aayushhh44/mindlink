import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Community() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts(res.data.posts);
    } catch {
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/community/post', { content }); // Backend expects { content }
      setContent('');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Post failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">Post</button>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map(post => (
              <li key={post.postId} className="border p-2 rounded flex justify-between">
                <span>{post.content}</span>
                <span className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 