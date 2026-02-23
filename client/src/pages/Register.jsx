import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'

const Register = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/auth/register', form)
      setAuth({ token: data.token, user: data.user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="main" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="card">
        <h2>Create account</h2>
        <p className="quote">Start tracking your digital wellness today.</p>
        <form className="grid" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <div className="badge poor">{error}</div>}
          <button className="btn" type="submit">
            Create account
          </button>
        </form>
        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
