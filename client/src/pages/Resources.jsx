import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data.resources);
    } catch {
      setResources([]);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/resources', { title, type }); // Backend expects { title, type }
      setTitle('');
      setType('');
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Educational Resources</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Type (e.g. article, video)"
          value={type}
          onChange={e => setType(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Upload Resource</button>
      </form>
      {resources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <ul className="space-y-2">
          {resources.map(resource => (
            <li key={resource.resourceId} className="border p-2 rounded flex justify-between">
              <span>{resource.title} <span className="text-xs text-gray-500">({resource.type})</span></span>
              <span className="text-xs text-gray-400">By: {resource.uploadedBy}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 