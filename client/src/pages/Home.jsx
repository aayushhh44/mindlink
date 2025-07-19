import { Link } from 'react-router-dom';
import { Brain, Users, CalendarCheck, BookOpen, MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-gray-900">
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-lg">
            <Brain className="w-8 h-8" /> MindLink
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Your Mental Health, Connected
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-xl">
            MindLink empowers young adults in Malaysia to connect with psychiatrists, take self-assessments, book appointments, access resources, and join a supportive community.
          </p>
        </div>
        <div className="flex justify-center gap-6 mb-10">
          <Link to="/login" className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Login</Link>
          <Link to="/register" className="px-8 py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">Register</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          <Feature icon={<Users className="w-7 h-7 text-blue-500" />} title="Connect with Psychiatrists" desc="Find and book appointments with trusted professionals." />
          <Feature icon={<BookOpen className="w-7 h-7 text-purple-500" />} title="Self-Assessments" desc="Take quizzes to understand your mental health." />
          <Feature icon={<CalendarCheck className="w-7 h-7 text-green-500" />} title="Easy Appointments" desc="Schedule and manage your mental health sessions." />
          <Feature icon={<MessageCircle className="w-7 h-7 text-pink-500" />} title="Community Forum" desc="Share, support, and grow together in a safe space." />
        </div>
        <blockquote className="italic text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto border-l-4 border-blue-400 pl-4">
          “Mental health is not a destination, but a process. It's about how you drive, not where you're going.”
          <span className="block mt-2 text-sm text-gray-500">— Noam Shpancer, PhD</span>
        </blockquote>
      </main>
      <Footer />
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="mb-2">{icon}</div>
      <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-6 mt-8">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 gap-2 text-gray-600 dark:text-gray-400 text-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Brain className="w-5 h-5 text-blue-500" />
          <span className="font-semibold">MindLink</span>
        </div>
        <div className="flex gap-4">
          <Link to="/resources" className="hover:underline">Resources</Link>
          <Link to="/community" className="hover:underline">Community</Link>
          <Link to="/appointments" className="hover:underline">Appointments</Link>
        </div>
        <div className="text-xs">&copy; {new Date().getFullYear()} MindLink. All rights reserved.</div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-2">Empowering mental health, one connection at a time.</div>
    </footer>
  );
} 