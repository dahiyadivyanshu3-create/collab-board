const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const boardRoutes = require('./routes/boardRoutes')
const listRoutes = require('./routes/listRoutes')
const cardRoutes = require('./routes/cardRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/boards', boardRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/cards', cardRoutes)

app.get('/', (req, res) => {
  res.send('Backend is working!')
})

app.get('/api/greeting',(req,res)=>{
    res.json({message:'hello from backend'})
})

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('mongodb connected succesfully'))
.catch((err)=>console.log("mongo connection error:",err))

const PORT =process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Server running on http://localhost:5000')
})