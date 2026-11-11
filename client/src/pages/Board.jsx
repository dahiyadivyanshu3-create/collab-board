import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { io } from 'socket.io-client'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { ArrowLeft, Plus, X } from 'lucide-react'

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

function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [lists, setLists] = useState([])
  const [cardsByList, setCardsByList] = useState({})
  const [newCardText, setNewCardText] = useState({})
  const [newListTitle, setNewListTitle] = useState('')
  const [activeCardList, setActiveCardList] = useState(null)
  const [showListForm, setShowListForm] = useState(false)

 
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
    const response = await api.get(`/api/boards/${id}`)
    setBoard(response.data)
  } catch (error) {
    console.log('Error fetching board:', error)
  }
}

const fetchLists = async () => {
  try {
    const response = await api.get(`/api/lists/${id}`)
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
    const response = await api.get(`/api/cards/${listId}`)
    setCardsByList((prev) => ({ ...prev, [listId]: response.data }))
  } catch (error) {
    console.log('Error fetching cards:', error)
  }
}

const handleAddList = async () => {
  if (newListTitle.trim() === '') return

  try {
    await api.post('/api/lists', { title: newListTitle, board: id })
    setNewListTitle('')
    setShowListForm(false)
    fetchLists()
  } catch (error) {
    console.log('Error adding list:', error)
  }
}

const handleAddCard = async (listId) => {
  const text = newCardText[listId]
  if (!text || text.trim() === '') return

  try {
    await api.post('/api/cards', { text, list: listId })
    setNewCardText({ ...newCardText, [listId]: '' })
    fetchCards(listId)
  } catch (error) {
    console.log('Error adding card:', error)
  }
}

  const closeCardForm = (listId) => {
    setActiveCardList(null)
    setNewCardText({ ...newCardText, [listId]: '' })
  }

  const closeListForm = () => {
    setShowListForm(false)
    setNewListTitle('')
  }

  const handleDragEnd = async (event) => {
  const { active, over } = event

  if (!over) return

  const cardId = active.id
  const newListId = over.id

  try {
    await api.put(`/api/cards/${cardId}`, { list: newListId, boardId: id })
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
            {lists.map((list) => {
              const cards = cardsByList[list._id]

              return (
                <DroppableList
                  key={list._id}
                  list={list}
                  count={(cards || []).length}
                >
                  {cards && cards.length === 0 && (
                    <p className="mb-2 px-1 py-2 text-center text-xs text-gray-400">
                      No cards yet
                    </p>
                  )}

                  {cards &&
                    cards.map((card) => <DraggableCard key={card._id} card={card} />)}

                  {activeCardList === list._id ? (
                    <div>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Card title"
                        value={newCardText[list._id] || ''}
                        onChange={(e) =>
                          setNewCardText({ ...newCardText, [list._id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddCard(list._id)
                          if (e.key === 'Escape') closeCardForm(list._id)
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleAddCard(list._id)}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                          Add card
                        </button>
                        <button
                          onClick={() => closeCardForm(list._id)}
                          aria-label="Cancel"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveCardList(list._id)}
                      className="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add card
                    </button>
                  )}
                </DroppableList>
              )
            })}

            <div className="w-72 shrink-0">
              {showListForm ? (
                <div className="rounded-xl bg-gray-100 p-3">
                  <input
                    autoFocus
                    type="text"
                    placeholder="List name"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddList()
                      if (e.key === 'Escape') closeListForm()
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={handleAddList}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      Add list
                    </button>
                    <button
                      onClick={closeListForm}
                      aria-label="Cancel"
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowListForm(true)}
                  className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add list
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </main>
    </div>
  )
}

export default Board