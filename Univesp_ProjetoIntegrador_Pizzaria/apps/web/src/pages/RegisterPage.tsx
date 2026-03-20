import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await auth.register({ name, email, password })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container auth">
      <div className="auth__card">
        <h2 className="auth__title">Criar conta</h2>
        <p className="muted">Cadastre-se para fidelização e histórico de pedidos.</p>

        {error ? <div className="alert">{error}</div> : null}

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field__label">Nome</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>

          <label className="field">
            <span className="field__label">E-mail</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className="field">
            <span className="field__label">Senha</span>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <div className="auth__bottom">
          <span className="muted">Já tem conta?</span> <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  )
}
