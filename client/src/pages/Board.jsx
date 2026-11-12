import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { io } from 'socket.io-client'
import { ArrowLeft } from 'lucide-react'
import api from '../api'
import DraggableCard from '../components/DraggableCard'
import DroppableList from '../components/DroppableList'
import AddCardForm from '../components/AddCardForm'
import AddListForm from '../components/AddListForm'
import InviteMembers from '../components/InviteMembers'

function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [lists, setLists] = useState([])
  const [cardsByList, setCardsByList] = useState({})
  const [activeCardList, setActiveCardList] = useState(null)

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

  const handleAddList = async (title) => {
    try {
      await api.post('/api/lists', { title, board: id })
      fetchLists()
      return true
    } catch (error) {
      console.log('Error adding list:', error)
      return false
    }
  }

  const handleAddCard = async (listId, text) => {
    try {
      await api.post('/api/cards', { text, list: listId })
      fetchCards(listId)
      return true
    } catch (error) {
      console.log('Error adding card:', error)
      return false
    }
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

{board && (
  <div className="ml-auto">
    <InviteMembers
      boardId={id}
      isOwner={board.isOwner}
      owner={board.owner}
      members={board.members}
      onInvited={fetchBoard}
    />
  </div>
)}

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

                  <AddCardForm
                    isOpen={activeCardList === list._id}
                    onOpen={() => setActiveCardList(list._id)}
                    onClose={() => setActiveCardList(null)}
                    onAdd={(text) => handleAddCard(list._id, text)}
                  />
                </DroppableList>
              )
            })}

            <div className="w-72 shrink-0">
              <AddListForm onAdd={handleAddList} />
            </div>
          </div>
        </DndContext>
      </main>
    </div>
  )
}

export default Board