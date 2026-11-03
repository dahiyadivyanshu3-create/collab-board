import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LayoutDashboard, Plus, LogOut } from 'lucide-react'

const tileColors = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
]

function Dashboard() {
  const [boards, setBoards] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchBoards = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/boards`,
        { headers: { Authorization: token } }
      )
      setBoards(response.data)
    } catch (error) {
      console.log('Error fetching boards:', error)
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
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
          <h1 className="text-2xl font-semibold text-gray-900">My boards</h1>

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

        {boards.length === 0 ? (
          <p className="mt-12 text-center text-sm text-gray-500">
            No boards yet. Create your first board to get started.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {boards.map((board, index) => (
              <Link
                key={board._id}
                to={`/board/${board._id}`}
                className={`block h-28 rounded-xl p-4 font-medium hover:shadow-md transition-shadow ${tileColors[index % tileColors.length]}`}
              >
                {board.title}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard