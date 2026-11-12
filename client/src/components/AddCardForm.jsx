import { useState } from 'react'
import { Plus, X } from 'lucide-react'

function AddCardForm({ isOpen, onOpen, onClose, onAdd }) {
  const [text, setText] = useState('')

  const handleClose = () => {
    setText('')
    onClose()
  }

  const handleSubmit = async () => {
    if (text.trim() === '') return

    const ok = await onAdd(text)
    if (ok) setText('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add card
      </button>
    )
  }

  return (
    <div>
      <input
        autoFocus
        type="text"
        placeholder="Card title"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
          Add card
        </button>
        <button
          onClick={handleClose}
          aria-label="Cancel"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default AddCardForm