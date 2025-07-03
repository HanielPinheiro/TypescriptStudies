import { AuthForm } from '../lib/components/AuthForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}