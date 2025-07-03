import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type User } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // TODO: replace with real API call
    if (username === 'admin' && password === '123') {
      setUser({ username });
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


