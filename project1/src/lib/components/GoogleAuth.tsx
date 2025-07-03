import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../hooks/useAuth'

export function GoogleAuth() {
  const { loginWithGoogle } = useAuth()

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={credentialResponse => {
          // Verify credential with your backend
          console.log(credentialResponse)
          loginWithGoogle()
        }}
        onError={() => {
          console.log('Login Failed')
        }}
        useOneTap
      />
    </GoogleOAuthProvider>
  )
}