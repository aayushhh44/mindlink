import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [psychiatrists, setPsychiatrists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [roleUpdating, setRoleUpdating] = useState(null);
  const [roleSelections, setRoleSelections] = useState({});
  const [resetting, setResetting] = useState(null);
  const [resetPasswordModal, setResetPasswordModal] = useState({ open: false, userId: null });
  const [newPassword, setNewPassword] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [psyRes, patRes, userRes] = await Promise.all([
        api.get('/auth/admin/psychiatrists'),
        api.get('/auth/admin/patients'),
        api.get('/auth/admin/users'),
      ]);
      setPsychiatrists(psyRes.data.psychiatrists || []);
      setPatients(patRes.data.patients || []);
      setUsers(userRes.data.users || []);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleting(userId);
    try {
      await api.delete(`/auth/admin/user/${userId}`);
      await fetchData();
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleSelections(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleRoleUpdate = async (userId) => {
    const newRole = roleSelections[userId];
    if (!newRole) return;
    setRoleUpdating(userId);
    try {
      await api.post('/auth/admin/user/role', { userId, newRole });
      await fetchData();
    } catch (err) {
      alert('Failed to update user role');
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !resetPasswordModal.userId) return;
    setResetting(resetPasswordModal.userId);
    try {
      await api.post('/auth/admin/user/reset-password', { userId: resetPasswordModal.userId, newPassword });
      setResetPasswordModal({ open: false, userId: null });
      setNewPassword('');
    } catch (err) {
      alert('Failed to reset password');
    } finally {
      setResetting(null);
    }
  };

  const handleExportUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/auth/admin/export-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to export users');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export users');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          onClick={handleExportUsers}
        >
          <Download className="w-5 h-5" /> Export Users (CSV)
        </button>
      </div>
      <h2 className="text-3xl font-extrabold mb-6 text-center">Admin Dashboard</h2>
      {resetPasswordModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h3 className="text-lg font-bold mb-2">Reset Password</h3>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={resetting}
            />
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                onClick={() => { setResetPasswordModal({ open: false, userId: null }); setNewPassword(''); }}
                disabled={resetting}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                onClick={handleResetPassword}
                disabled={resetting || !newPassword}
              >{resetting ? 'Resetting...' : 'Reset'}</button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <Section title="All Users" data={users} onDelete={handleDelete} deleting={deleting} onRoleChange={handleRoleChange} onRoleUpdate={handleRoleUpdate} roleSelections={roleSelections} roleUpdating={roleUpdating} onResetPassword={userId => setResetPasswordModal({ open: true, userId })} />
          <Section title="Psychiatrists" data={psychiatrists} />
          <Section title="Patients" data={patients} />
        </>
      )}
    </div>
  );
}

function Section({ title, data, onDelete, deleting, onRoleChange, onRoleUpdate, roleSelections, roleUpdating, onResetPassword }) {
  const roles = ['admin', 'psychiatrist', 'patient'];
  return (
    <div className="mb-8 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {data.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <table className="w-full border text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">User ID</th>
              {onRoleChange && <th className="p-2 border">Change Role</th>}
              {onDelete && <th className="p-2 border">Actions</th>}
              {onResetPassword && <th className="p-2 border">Reset Password</th>}
            </tr>
          </thead>
          <tbody>
            {data.map(u => (
              <tr key={u.userId} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <td className="p-2 border whitespace-nowrap">{u.name}</td>
                <td className="p-2 border whitespace-nowrap">{u.email}</td>
                <td className="p-2 border whitespace-nowrap capitalize">{u.role}</td>
                <td className="p-2 border text-xs break-all">{u.userId}</td>
                {onRoleChange && (
                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={roleSelections?.[u.userId] || u.role}
                        onChange={e => onRoleChange(u.userId, e.target.value)}
                        disabled={roleUpdating === u.userId}
                      >
                        {roles.map(r => (
                          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                        onClick={() => onRoleUpdate(u.userId)}
                        disabled={roleUpdating === u.userId || (roleSelections?.[u.userId] || u.role) === u.role}
                      >
                        {roleUpdating === u.userId ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </td>
                )}
                {onDelete && (
                  <td className="p-2 border text-center">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                      onClick={() => onDelete(u.userId)}
                      disabled={deleting === u.userId}
                    >
                      {deleting === u.userId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                )}
                {onResetPassword && (
                  <td className="p-2 border text-center">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => onResetPassword(u.userId)}
                    >Reset</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 