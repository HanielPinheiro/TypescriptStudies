import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './lib/components/ProtectedRoute';
import Login from './lib/pages/Login';
import Dashboard from './lib/pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
