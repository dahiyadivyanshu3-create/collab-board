import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import api from '../api'

// Board ke upar right mein: members ke initials + (sirf owner ko) Invite button
function InviteMembers({ boardId, isOwner, owner, members, onInvited }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const people = [owner, ...(members || [])].filter(Boolean)

  const close = () => {
    setOpen(false)
    setEmail('')
    setMessage('')
  }

  const handleInvite = async () => {
    if (email.trim() === '') return

    setLoading(true)
    setMessage('')
    try {
      await api.post(`/api/boards/${boardId}/members`, { email })
      setIsError(false)
      setMessage('Member added!')
      setEmail('')
      onInvited()
    } catch (error) {
      setIsError(true)
      setMessage(error.response?.data?.error || 'Could not invite. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center gap-3">
      <div className="flex -space-x-2">
        {people.map((person) => (
          <span
            key={person._id}
            title={person.name}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-semibold text-indigo-700"
          >
            {person.name.charAt(0).toUpperCase()}
          </span>
        ))}
      </div>

      {isOwner && (
        <button
          onClick={() => (open ? close() : setOpen(true))}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
          <input
            autoFocus
            type="email"
            placeholder="Their email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInvite()
              if (e.key === 'Escape') close()
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleInvite}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Adding...' : 'Add member'}
            </button>
            <button
              onClick={close}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
          {message && (
            <p className={`mt-2 text-xs ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default InviteMembers