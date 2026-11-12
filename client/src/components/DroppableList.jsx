import { useDroppable } from '@dnd-kit/core'
import { Trash2 } from 'lucide-react'

// Har list ko apni id se ek stable accent color milta hai
const ACCENTS = [
  'border-t-indigo-400',
  'border-t-emerald-400',
  'border-t-amber-400',
  'border-t-rose-400',
  'border-t-sky-400',
  'border-t-violet-400'
]

function DroppableList({ list, count, onDelete, children }) {
  const accent = ACCENTS[list._id.charCodeAt(list._id.length - 1) % ACCENTS.length]

  const { setNodeRef, isOver } = useDroppable({
    id: list._id
  })

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 rounded-xl border-t-4 p-3 shadow-sm transition-colors ${accent} ${
        isOver ? 'bg-indigo-50 ring-2 ring-indigo-300' : 'bg-slate-100/80 ring-1 ring-slate-200'
      }`}
    >
      <div className="group/head mb-3 flex items-center justify-between gap-2 px-1">
        <h3 className="truncate text-sm font-semibold text-gray-800">{list.title}</h3>

        <div className="flex items-center gap-1">
          <button
            onClick={onDelete}
            aria-label={`Delete list ${list.title}`}
            className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 sm:opacity-0 sm:group-hover/head:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
            {count}
          </span>
        </div>
      </div>

      {children}
    </div>
  )
}

export default DroppableList