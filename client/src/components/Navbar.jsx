import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Link to="/" className="font-bold text-lg">MindLink</Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin-dashboard" className="font-semibold text-blue-600">Admin Dashboard</Link>
            ) : (
              <Link to="/dashboard">Dashboard</Link>
            )}
            <Link to="/appointments">Appointments</Link>
            {user.role !== 'admin' && <Link to="/quiz">Quiz</Link>}
            <Link to="/resources">Resources</Link>
            <Link to="/community">Community</Link>
            <Link to="/profile">Profile</Link>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.name} <span className="capitalize text-xs text-gray-500">({user.role})</span></span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded ml-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
} 