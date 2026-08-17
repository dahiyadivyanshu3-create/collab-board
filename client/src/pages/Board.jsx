import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'

function DraggableCard({ card }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card._id
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={{
        background: 'white',
        padding: '8px',
        marginBottom: '8px',
        cursor: 'grab',
        ...style
      }}
      {...listeners}
      {...attributes}
    >
      {card.text}
    </div>
  )
}

function DroppableList({ list, children }) {
  const { setNodeRef } = useDroppable({
    id: list._id
  })

  return (
    <div
      ref={setNodeRef}
      style={{ background: '#eee', padding: '10px', width: '220px', minHeight: '100px' }}
    >
      <h3>{list.title}</h3>
      {children}
    </div>
  )
}

function Board() {
  const { id } = useParams()
  const [lists, setLists] = useState([])
  const [cardsByList, setCardsByList] = useState({})
  const [newCardText, setNewCardText] = useState({})
  const [newListTitle, setNewListTitle] = useState('')

  const token = localStorage.getItem('token')
  const socketRef = useRef(null)

  useEffect(() => {
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

  const fetchLists = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/lists/${id}`, {
        headers: { Authorization: token }
      })
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cards/${listId}`, {
        headers: { Authorization: token }
      })
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
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '20px' }}>Board Page (ID: {id})</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {lists.map((list) => (
            <DroppableList key={list._id} list={list}>
              {cardsByList[list._id] && cardsByList[list._id].map((card) => (
                <DraggableCard key={card._id} card={card} />
              ))}

              <input
                type="text"
                placeholder="New card text"
                value={newCardText[list._id] || ''}
                onChange={(e) => setNewCardText({ ...newCardText, [list._id]: e.target.value })}
                style={{ width: '100%', padding: '6px', marginTop: '6px', boxSizing: 'border-box' }}
              />
              <button onClick={() => handleAddCard(list._id)} style={{ marginTop: '6px', width: '100%' }}>
                + Add Card
              </button>
            </DroppableList>
          ))}

          <div style={{ padding: '10px' }}>
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
    </div>
  )
}

export default Board