import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Appointments() {
  const [doctorId, setDoctorId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.appointments);
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/appointments/book', { doctorId, dateTime });
      setDoctorId('');
      setDateTime('');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Doctor ID"
          value={doctorId}
          onChange={e => setDoctorId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Book</button>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Your Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map(appt => (
              <li key={appt.appointmentId} className="border p-2 rounded flex justify-between">
                <span>Doctor: <b>{appt.doctorId}</b></span>
                <span className="text-xs text-gray-500">{new Date(appt.dateTime).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 