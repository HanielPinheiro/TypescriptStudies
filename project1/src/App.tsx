// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { NavBar } from './lib/components/NavBar'
// import Home from './pages/Home'
// import Auth from './pages/Auth'
// import Dashboard from './pages/Dashboard'
// import Profile from './pages/Profile'

// import { useAuth } from './lib/hooks/useAuth'

// import './lib/css/App.css'

// function App() {
//    const { user, is2FAVerified } = useAuth()

//   return (
//     <BrowserRouter>
//       {/* Primeiro deve ser o cabeçalho (foto) */}
//       {/* Ao lado deve vir um component de login e senha com google auth ou inicio com cpf */}
//       <NavBar />
//       <main className="container mx-auto p-4">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path='/home' element={<Home />} />
//           <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/home" />} />
//           <Route path="/dashboard" element={ user ? (is2FAVerified ? (<Dashboard />) : (<Navigate to="/auth?mode=2fa" />)) : (<Navigate to="/auth" />)}/>
//           <Route path="/profile/:id" element={ user ? (is2FAVerified ? (<Profile />) : (<Navigate to="/auth?mode=2fa" />)) : (<Navigate to="/auth" />)}/>
//         </Routes>
//       </main>
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import NavBar from './lib/components/NavBar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

import './lib/css/App.css'

export default function App() {
  return (
    <Router>
      <NavBar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  )
}