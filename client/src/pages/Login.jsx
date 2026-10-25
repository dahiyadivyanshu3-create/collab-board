import { useState } from 'react'
import { useNavigate ,Link } from 'react-router-dom'
import axios from 'axios'
import { LayoutDashboard, Zap, Users, Lock, Monitor } from 'lucide-react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const features = [
  { icon: Zap, label: 'Real-time collaboration' },
  { icon: Users, label: 'Team friendly' },
  { icon: Lock, label: 'Secure and reliable' },
  { icon: Monitor, label: 'Access anywhere' },
]

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

      {/* left side */}
      <div className='hidden lg:flex w-1/2 bg-blue-50 flex-col px-16 justify-center'>
       
       <div className='max-w-md'>
<div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
    <LayoutDashboard className="h-5 w-5 text-white" />
  </div>
  <span className="text-2xl font-semibold text-gray-900">CollabBoard</span>
</div>

<h2 className="mt-10 text-4xl font-bold leading-tight text-gray-900">
  Plan. Collaborate. Build. Together.
</h2>

<p className="mt-4 text-gray-600">
  A real-time collaborative board for teams, students and creators.
  Organize your work, share ideas and get things done together.
</p>

<div className="mt-8 grid grid-cols-4 gap-4">
  {features.map((f) => {
    const Icon = f.icon
    return (
      <div key={f.label} className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
        <span className="text-xs text-gray-600">{f.label}</span>
      </div>
    )
  })}
</div>
  
       </div>
      </div>
      {/* left side */}
      <div className='w-full lg:w-1/2 bg-white flex items-center justify-center'>
        <div className='w-full max-w-sm px-6'>
          <h1 className='text-2xl font-semibold text-gray-900'>Welcome Back</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Log in to continue to your CollabBoard workspace
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1.5'>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
             <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
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