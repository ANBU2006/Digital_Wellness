import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'

const Login = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/auth/login', form)
      setAuth({ token: data.token, user: data.user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="main" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="card">
        <h2>Login</h2>
        <p className="quote">
          Welcome back. Keep your balance strong to stay sharp.
        </p>
        <form className="grid" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              style={{ fontSize: '1.05rem', padding: '14px 16px' }}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              style={{ fontSize: '1.05rem', padding: '14px 16px' }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <div className="badge poor">{error}</div>}
          <button className="btn" type="submit">
            Sign in
          </button>
        </form>
        <p style={{ marginTop: 12 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
