import { useState } from 'react'
import { useNavigate ,Link } from 'react-router-dom'
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
    <div className='min-h-screen flex'>
      <div className='hidden lg:flex w-1/2 bg-blue-50 items-center justify-center'>
        leftside
      </div>
      <div className='w-full lg:w-1/2 bg-white flex items-center justify-center'>
        <div className='w-full max-w-sm px-6'>
          <h1 className='text-2xl font-semibold text-gray-900'>Welcome Back</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Log in to continue to your CollabBoard workspace
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="Email Address" className='block text-sm font-medium text-gray-700 mb-1.5'> Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input

                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>

          </div>

          <button onClick={handleLogin}className='mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors'>
            Login
          </button>

          {error && <p className='mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}

          <p className='mt-6 text-center text-sm text-gray-600'>
            Don’t have an account?
            <Link to={"/signup"} className='font-medium text-indigo-600 hover:text-indigo-700'>Signup </Link>
          </p>
         
        </div>
      </div>

    </div>
  )
}

export default Login