const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const boardRoutes = require('./routes/boardRoutes')
const listRoutes = require('./routes/listRoutes')
const cardRoutes = require('./routes/cardRoutes')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.set('io', io)

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/cards', cardRoutes)

app.get('/', (req, res) => {
  res.send('Backend is working!')
})

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('joinBoard', (boardId) => {
    socket.join(boardId)
    console.log(`User joined board: ${boardId}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})