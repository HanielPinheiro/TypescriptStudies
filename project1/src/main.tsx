import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import './lib/css/main.css'
import App from './App.tsx'
import { AuthProvider } from './lib/contexts/AuthProvider.tsx'

// import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <BrowserRouter>
      <AuthProvider>
      <App />
       </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
