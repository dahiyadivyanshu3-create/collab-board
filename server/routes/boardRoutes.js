const express = require('express')
const router = express.Router()
const Board = require('../models/Board')
const authMiddleware = require('../middleware/authMiddleware')
const { requireBoardAccess, boardIdFromParam } = require('../middleware/boardAccess')

router.post('/', authMiddleware, async (req, res) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
    if (!title || title.length > 100) {
      return res.status(400).json({ error: 'Title is required (max 100 characters)' })
    }

    const newBoard = new Board({ title, owner: req.userId })
    const savedBoard = await newBoard.save()
    res.status(201).json(savedBoard)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.userId })
    res.json(boards)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', authMiddleware, requireBoardAccess(boardIdFromParam('id')), (req, res) => {
  res.json(req.board)
})

module.exports = router