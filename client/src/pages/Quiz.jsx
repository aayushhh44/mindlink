import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [qRes, rRes] = await Promise.all([
          api.get('/quiz/questions'),
          api.get('/quiz'),
        ]);
        setQuestions(qRes.data.questions || []);
        setResults(rRes.data.results || []);
      } catch (err) {
        setError('Failed to load quiz data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (qid, value) => {
    setAnswers(a => ({ ...a, [qid]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // For demo, score is number of answered questions
    const userScore = Object.keys(answers).length;
    setScore(userScore);
    try {
      await api.post('/quiz/submit', { score: userScore });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Quiz submission failed');
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Self-Assessment Quiz</h2>
        {loading ? (
          <p>Loading quiz...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : questions.length === 0 ? (
          <p>No quiz questions available.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <div className="font-semibold mb-2">{q.question}</div>
                <div className="flex flex-col gap-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        required
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">Submit Quiz</button>
          </form>
        )}
      </div>
      <div className="max-w-md mx-auto mt-8">
        <h3 className="text-xl font-semibold mb-2">Your Quiz Results</h3>
        {results.length === 0 ? (
          <p>No quiz results yet.</p>
        ) : (
          <ul className="space-y-2">
            {results.map(qr => (
              <li key={qr.quizId} className="border p-2 rounded flex justify-between">
                <span>Score: <b>{qr.score}</b></span>
                <span className="text-xs text-gray-500">{new Date(qr.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 