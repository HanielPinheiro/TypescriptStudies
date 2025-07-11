import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import '../css/login.css';
import { AVATAR3 } from '../ts/constants';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // import { useEffect } from 'react';

  // Theme toggle logic
  // const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // useEffect(() => {
  //   document.documentElement.className = theme;
  //   localStorage.setItem('theme', theme);
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid login: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-yellow-300 to-yellow-600">
      {/* Theme toggle button */}
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 text-xs px-2 py-1 border rounded bg-white dark:bg-gray-900"
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button> */}

      <section className="flex flex-col md:flex-row w-full bg-cover bg-center">
        {/* Imagem à esquerda (ou em cima no mobile) */}
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img src="/assets/login/Logomarca_HQ.png" alt="background" className="w-full h-full object-cover" />
        </div>

        {/* Card à direita (ou embaixo no mobile) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-md py-12 px-4">
          <div className="card p-8 rounded-lg shadow-lg w-full max-w-md animate-fadeInUp">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Login</h2>

            {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="E-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              />

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="flex justify-between text-sm">
                <button type="button" className="text-blue-600 dark:text-blue-400">
                  Cadastre-se
                </button>
                <button type="button" className="text-blue-600 dark:text-blue-400">
                  Esqueceu sua senha?
                </button>
              </div>

              <button type="button" className="w-full border border-gray-400 dark:border-gray-600 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
                Acesse com o Google
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* div2: variable content */}
      <section className="bg-gray-100 dark:bg-gray-800 text-center py-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Join the Vibe</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Connect with your favorite creators and explore exclusive content.</p>
        <p className="flex justify-center bg-gray-100 dark:bg-gray-800">
          <img src={AVATAR3} alt="avatar" width={500} />
        </p>
      </section>

      {/* div3: footer */}
      <footer className="bg-gray-900 text-white text-sm p-4 text-center">
        &copy; {new Date().getFullYear()} Lybertyn. All rights reserved. | <a href="#">Privacy</a> | <a href="#">Terms</a>
      </footer>
    </div>
  );
};

export default Login;
