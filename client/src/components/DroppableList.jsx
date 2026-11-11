import { useDroppable } from '@dnd-kit/core'

function DroppableList({ list, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: list._id
  })

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 rounded-xl p-3 transition-colors ${
        isOver ? 'bg-indigo-50 ring-2 ring-indigo-300' : 'bg-gray-100'
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-800">{list.title}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
          {count}
        </span>
      </div>

      {children}
    </div>
  )
}

export default DroppableList