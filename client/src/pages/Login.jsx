import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      })

      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Login failed. Check your email/password.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
      />

      <button onClick={handleLogin} style={{ padding: '8px 16px' }}>
        Login
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login