import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { ArrowLeft } from 'lucide-react'

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
      className={`relative mb-2 cursor-grab rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm ${isDragging ? 'z-50 opacity-80 shadow-lg ring-2 ring-indigo-300' : 'hover:shadow-md'
        }`}
      {...listeners}
      {...attributes}
    >
      {card.text}
    </div>
  )
}


function DroppableList({ list, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: list._id
  })

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 rounded-xl p-3 transition-colors ${isOver ? 'bg-indigo-50 ring-2 ring-indigo-300' : 'bg-gray-100'
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

function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [lists, setLists] = useState([])
  const [cardsByList, setCardsByList] = useState({})
  const [newCardText, setNewCardText] = useState({})
  const [newListTitle, setNewListTitle] = useState('')

  const token = localStorage.getItem('token')
  const socketRef = useRef(null)

  useEffect(() => {
    fetchBoard()
    fetchLists()
  }, [id])

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL)
    socketRef.current.emit('joinBoard', id)

    socketRef.current.on('cardUpdated', () => {
      fetchLists()
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [id])

  const fetchBoard = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/boards/${id}`,
        { headers: { Authorization: token } }
      )
      setBoard(response.data)
    } catch (error) {
      console.log('Error fetching board:', error)
    }
  }

  const fetchLists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lists/${id}`,
        { headers: { Authorization: token } }
      )
      setLists(response.data)

      response.data.forEach((list) => {
        fetchCards(list._id)
      })
    } catch (error) {
      console.log('Error fetching lists:', error)
    }
  }

  const fetchCards = async (listId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cards/${listId}`,
        { headers: { Authorization: token } }
      )
      setCardsByList((prev) => ({ ...prev, [listId]: response.data }))
    } catch (error) {
      console.log('Error fetching cards:', error)
    }
  }

  const handleAddList = async () => {
    if (newListTitle.trim() === '') return

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lists`,
        { title: newListTitle, board: id },
        { headers: { Authorization: token } }
      )
      setNewListTitle('')
      fetchLists()
    } catch (error) {
      console.log('Error adding list:', error)
    }
  }

  const handleAddCard = async (listId) => {
    const text = newCardText[listId]
    if (!text || text.trim() === '') return

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cards`,
        { text, list: listId },
        { headers: { Authorization: token } }
      )
      setNewCardText({ ...newCardText, [listId]: '' })
      fetchCards(listId)
    } catch (error) {
      console.log('Error adding card:', error)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const cardId = active.id
    const newListId = over.id

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
        { list: newListId, boardId: id },
        { headers: { Authorization: token } }
      )
      fetchLists()
    } catch (error) {
      console.log('Error moving card:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4 px-6 py-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Boards
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-semibold text-gray-900">
            {board ? board.title : 'Board'}
          </h1>
        </div>
      </header>

      <main className="p-6">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex items-start gap-4 overflow-x-auto pb-4">
            {lists.map((list) => (
              <DroppableList
                key={list._id}
                list={list}
                count={(cardsByList[list._id] || []).length}
              >
                {cardsByList[list._id] &&
                  cardsByList[list._id].map((card) => (
                    <DraggableCard key={card._id} card={card} />
                  ))}

                <input
                  type="text"
                  placeholder="New card text"
                  value={newCardText[list._id] || ''}
                  onChange={(e) =>
                    setNewCardText({ ...newCardText, [list._id]: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '6px',
                    marginTop: '6px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={() => handleAddCard(list._id)}
                  style={{ marginTop: '6px', width: '100%' }}
                >
                  + Add Card
                </button>
              </DroppableList>
            ))}

            <div className="shrink-0 p-2.5">
              <input
                type="text"
                placeholder="New list title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
              <button onClick={handleAddList}>+ Add List</button>
            </div>
          </div>
        </DndContext>
      </main>
    </div>
  )
}

export default Board