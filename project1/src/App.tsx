import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './lib/components/ProtectedRoute';
import DashboardLayout from './lib/components/DashboardLayout';

import Login from './lib/pages/Login';
import Dashboard from './lib/pages/Dashboard';
import Perfil from './lib/pages/Perfil';

import { PAGE_ASSINATURAS, PAGE_CHAT, PAGE_CONTEUDO, PAGE_DASHBOARD, PAGE_LOGIN, PAGE_PERFIL, PAGE_SAIR } from './lib/ts/constants';
import Conteudo from './lib/pages/Conteudo';
import Chat from './lib/pages/Chat';
import Assinaturas from './lib/pages/Assinaturas';

function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path={PAGE_LOGIN} element={<Login />} />
      <Route path={PAGE_SAIR} element={<Login />} />

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
          path={PAGE_DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_CONTEUDO}
          element={
            <ProtectedRoute>
              <Conteudo />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_CHAT}
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_ASSINATURAS}
          element={
            <ProtectedRoute>
              <Assinaturas />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_PERFIL}
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
