import { useState } from 'react'
import { Plus, X } from 'lucide-react'

function AddListForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')

  const handleClose = () => {
    setIsOpen(false)
    setTitle('')
  }

  const handleSubmit = async () => {
    if (title.trim() === '') return

    const ok = await onAdd(title)
    if (ok) handleClose()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add list
      </button>
    )
  }

  return (
    <div className="rounded-xl bg-gray-100 p-3">
      <input
        autoFocus
        type="text"
        placeholder="List name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
          if (e.key === 'Escape') handleClose()
        }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Add list
        </button>
        <button
          onClick={handleClose}
          aria-label="Cancel"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default AddListForm