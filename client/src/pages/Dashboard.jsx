import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { CalendarCheck, User, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        if (user?.role === 'psychiatrist') {
          const apptRes = await api.get('/appointments/all');
          setAppointments(apptRes.data.appointments || []);
          setQuizResults([]);
          const userIds = [...new Set((apptRes.data.appointments || []).map(a => a.userId))];
          const userMapRes = await api.post('/auth/usernames', { userIds });
          setUserMap(userMapRes.data.userMap || {});
        } else {
          const [apptRes, quizRes] = await Promise.all([
            api.get('/appointments'),
            api.get('/quiz'),
          ]);
          setAppointments(apptRes.data.appointments || []);
          setQuizResults(quizRes.data.results || []);
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchData();
  }, [user]);

  if (!user) return <div className="max-w-2xl mx-auto mt-10">Loading...</div>;

  const stats = user.role === 'psychiatrist'
    ? [
        { label: 'Total Appointments', value: appointments.length, icon: <CalendarCheck className="w-5 h-5 text-green-600" /> },
        { label: 'Your Role', value: 'Psychiatrist', icon: <User className="w-5 h-5 text-blue-600" /> },
      ]
    : [
        { label: 'Appointments', value: appointments.length, icon: <CalendarCheck className="w-5 h-5 text-green-600" /> },
        { label: 'Quiz Results', value: quizResults.length, icon: <Award className="w-5 h-5 text-purple-600" /> },
        { label: 'Your Role', value: 'Patient', icon: <User className="w-5 h-5 text-blue-600" /> },
      ];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-2 sm:px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">{user.role === 'psychiatrist' ? 'Psychiatrist Dashboard' : 'Your Dashboard'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center border border-gray-100 dark:border-gray-800">
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Welcome, <span className="font-bold">{user.name}</span>!</p>
            <p className="text-gray-500 text-sm">Role: <span className="capitalize font-medium">{user.role}</span></p>
          </div>
        </div>
        {loading ? (
          <p className="mt-4 text-gray-500">Loading your data...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : user.role === 'psychiatrist' ? (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><CalendarCheck className="w-5 h-5" /> All Appointments</h3>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments found.</p>
            ) : (
              <ul className="space-y-2">
                {appointments.map(appt => (
                  <li key={appt.appointmentId} className="border p-3 rounded flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-50 dark:bg-gray-900">
                    <span>Patient: <b>{userMap[appt.userId] || appt.userId}</b></span>
                    <span>Doctor: <b>{appt.doctorId}</b></span>
                    <span className="text-xs text-gray-500">{new Date(appt.dateTime).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><CalendarCheck className="w-5 h-5" /> Your Appointments</h3>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {appointments.map(appt => (
                    <li key={appt.appointmentId} className="border p-3 rounded flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-50 dark:bg-gray-900">
                      <span>Doctor: <b>{appt.doctorId}</b></span>
                      <span className="text-xs text-gray-500">{new Date(appt.dateTime).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><Award className="w-5 h-5" /> Your Quiz Results</h3>
              {quizResults.length === 0 ? (
                <p className="text-gray-500">No quiz results yet.</p>
              ) : (
                <ul className="space-y-2">
                  {quizResults.map(qr => (
                    <li key={qr.quizId} className="border p-3 rounded flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-50 dark:bg-gray-900">
                      <span>Score: <b>{qr.score}</b></span>
                      <span className="text-xs text-gray-500">{new Date(qr.timestamp).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 