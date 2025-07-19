import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Appointments from './pages/Appointments';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon, Brain } from 'lucide-react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [dark, setDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  // Toggle dark mode
  const toggleDark = () => {
    setDark(d => {
      const newMode = !d;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };
  // Ensure dark mode class on mount
  useState(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, []);
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Navbar />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/quiz" element={
                <ProtectedRoute noAdmin>
                  <Quiz />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              {/* TODO: Add more routes */}
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 