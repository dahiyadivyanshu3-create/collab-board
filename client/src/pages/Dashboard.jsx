import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LayoutDashboard, Plus, LogOut, Users } from 'lucide-react'

// Har board card ke upar ki rangin patti
const bannerColors = [
  'from-indigo-400 to-violet-400',
  'from-emerald-400 to-teal-400',
  'from-amber-400 to-orange-400',
  'from-rose-400 to-pink-400',
  'from-sky-400 to-blue-400',
]

// Token ke andar se user id nikalta hai (sirf "Owner/Shared" dikhane ke liye, security ke liye nahi)
const getUserIdFromToken = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).id
  } catch {
    return null
  }
}

// MongoDB id ke pehle 8 characters mein banane ka time hota hai
const createdOn = (id) =>
  new Date(parseInt(id.substring(0, 8), 16) * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

function Dashboard() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = getUserIdFromToken(token)

  const fetchBoards = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/boards`,
        { headers: { Authorization: token } }
      )
      setBoards(response.data)
    } catch (error) {
      console.log('Error fetching boards:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const handleCreate = async () => {
    if (newTitle.trim() === '') return

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/boards`,
        { title: newTitle },
        { headers: { Authorization: token } }
      )
      setNewTitle('')
      setShowForm(false)
      fetchBoards()
    } catch (error) {
      console.log('Error creating board:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-sky-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">CollabBoard</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My boards</h1>
            {!loading && (
              <p className="mt-1 text-sm text-gray-500">
                {boards.length} {boards.length === 1 ? 'board' : 'boards'}
              </p>
            )}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New board
          </button>
        </div>

        {showForm && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Board name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setNewTitle('')
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-200/70" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-xl border-2 border-dashed border-gray-300 bg-white/50 px-6 py-12 text-center">
            <LayoutDashboard className="h-8 w-8 text-gray-400" />
            <p className="mt-3 text-sm text-gray-500">
              No boards yet. Create your first board to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {boards.map((board, index) => {
              const isOwner = board.owner === userId
              const memberCount = 1 + (board.members ? board.members.length : 0)

              return (
                <Link
                  key={board._id}
                  to={`/board/${board._id}`}
                  className="flex h-36 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`relative h-14 bg-linear-to-r ${bannerColors[index % bannerColors.length]}`}
                  >
                    {userId && (
                      <span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {isOwner ? 'Owner' : 'Shared'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-3">
                    <h3 className="truncate font-semibold text-gray-900">{board.title}</h3>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {memberCount} {memberCount === 1 ? 'member' : 'members'}
                      </span>
                      <span>{createdOn(board._id)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}

            <button
              onClick={() => setShowForm(true)}
              className="flex h-36 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 hover:border-gray-400 hover:bg-white/80 hover:text-gray-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New board
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard