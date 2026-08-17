import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const[boards,setBoards]=useState([])

useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/boards', {
          headers: { Authorization: token }
        })
        setBoards(response.data)
      } catch (error) {
        console.log('Error fetching boards:', error)
      }
    }

    fetchBoards()
  }, [])

  return (
    <div>
      <h1>My Boards</h1>
      <ul>
        {boards.map((board) => (
        <li key={board._id}>
         <Link to={`/board/${board._id}`}>{board.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard