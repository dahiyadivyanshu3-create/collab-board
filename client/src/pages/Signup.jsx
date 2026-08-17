import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        name,
        email,
        password
      })

      navigate('/')
    } catch (err) {
      setError('Signup failed. Try again.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Signup</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
      />

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

      <button onClick={handleSignup} style={{ padding: '8px 16px' }}>
        Signup
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p style={{ marginTop: '10px' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  )
}

export default Signup