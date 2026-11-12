import { useDraggable } from '@dnd-kit/core'
import { Trash2 } from 'lucide-react'

function DraggableCard({ card, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card._id
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/card relative mb-2 cursor-grab select-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm ${
        isDragging ? 'z-50 opacity-80 shadow-lg ring-2 ring-indigo-300' : 'hover:border-indigo-200 hover:shadow-md'
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 break-words">{card.text}</span>

        
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(card._id)}
          aria-label="Delete card"
          className="shrink-0 rounded p-0.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default DraggableCard