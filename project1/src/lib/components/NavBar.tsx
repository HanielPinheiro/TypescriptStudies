import { Link, useLocation } from 'react-router-dom';

export default function NavBar () {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          FanVerse
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/explore"
            className={`hover:text-indigo-400 ${isActive('/explore') ? 'text-indigo-400' : ''}`}
          >
            Explore
          </Link>
          <Link
            to="/subscriptions"
            className={`hover:text-indigo-400 ${
              isActive('/subscriptions') ? 'text-indigo-400' : ''
            }`}
          >
            Subscriptions
          </Link>
          <Link
            to="/messages"
            className={`hover:text-indigo-400 ${
              isActive('/messages') ? 'text-indigo-400' : ''
            }`}
          >
            Messages
          </Link>
          <Link
            to="/notifications"
            className={`hover:text-indigo-400 ${
              isActive('/notifications') ? 'text-indigo-400' : ''
            }`}
          >
            Notifications
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-400"
          >
            <img
              src="/default-avatar.jpg"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};