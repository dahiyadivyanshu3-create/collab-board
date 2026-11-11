import { useDraggable } from '@dnd-kit/core'

function DraggableCard({ card }) {
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
      className={`relative mb-2 cursor-grab rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm ${
        isDragging ? 'z-50 opacity-80 shadow-lg ring-2 ring-indigo-300' : 'hover:shadow-md'
      }`}
      {...listeners}
      {...attributes}
    >
      {card.text}
    </div>
  )
}

export default DraggableCard