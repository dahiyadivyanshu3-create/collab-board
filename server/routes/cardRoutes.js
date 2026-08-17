const express = require('express')
const router = express.Router()
const Card = require('../models/Card')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newCard = new Card({
      text: req.body.text,
      list: req.body.list
    })

    const savedCard = await newCard.save()
    res.json(savedCard)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:listId', authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find({ list: req.params.listId })
    res.json(cards)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:cardId', authMiddleware, async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { list: req.body.list },
      { returnDocument: 'after' }
    )

    const io = req.app.get('io')
    io.to(req.body.boardId).emit('cardUpdated')

    res.json(updatedCard)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router