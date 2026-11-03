const express = require('express')
const router = express.Router()
const Board = require('../models/Board')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/',authMiddleware, async (req, res) => {
  try {
    const newBoard = new Board({
      title: req.body.title,
      owner: req.userId
    })

    

    const savedBoard = await newBoard.save()
    res.json(savedBoard)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/',authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({owner:req.userId})
    res.json(boards)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.userId })

    if (!board) {
      return res.status(404).json({ error: 'Board not found' })
    }

    res.json(board)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router