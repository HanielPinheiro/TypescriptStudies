import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './lib/components/ProtectedRoute';
import Login from './lib/pages/Login';
import Dashboard from './lib/pages/Dashboard';
import DashboardLayout from './lib/components/DashboardLayout';

function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas (encapsuladas pelo DashboardLayout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
