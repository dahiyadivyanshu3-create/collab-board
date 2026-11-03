import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AuthLayout from '../components/AuthLayout'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        { name, email, password }
      )

      navigate('/')
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. It may be waking up, try again in a minute.')
      } else {
        setError('Signup failed. This email may already be registered.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">
        Start organizing your work with CollabBoard.
      </p>

      <form onSubmit={handleSignup}>
        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Signup