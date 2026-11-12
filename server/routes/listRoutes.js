const express = require('express')
const router = express.Router()
const List = require('../models/List')
const Card = require('../models/Card')
const authMiddleware = require('../middleware/authMiddleware')
const {
  requireBoardAccess,
  boardIdFromParam,
  boardIdFromBody,
  boardIdOfList
} = require('../middleware/boardAccess')

router.post('/', authMiddleware, requireBoardAccess(boardIdFromBody('board')), async (req, res) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
    if (!title || title.length > 100) {
      return res.status(400).json({ error: 'Title is required (max 100 characters)' })
    }

    const newList = new List({ title, board: req.board._id })
    const savedList = await newList.save()

    // Board ke baaki users ko live update
    req.app.get('io').to(String(req.board._id)).emit('cardUpdated')

    res.status(201).json(savedList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:boardId', authMiddleware, requireBoardAccess(boardIdFromParam('boardId')), async (req, res) => {
  try {
    const lists = await List.find({ board: req.board._id })
    res.json(lists)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// List deletion is allowed for all board members. The associated cards are cleaned up automatically.

// Keep list deletion as the final step. This helps avoid losing the list if card cleanup fails midway, making it easier to retry later.
router.delete(
  '/:listId',
  authMiddleware,
  requireBoardAccess(boardIdOfList((req) => req.params.listId)),
  async (req, res) => {
    try {
      await Card.deleteMany({ list: req.params.listId })
      await List.deleteOne({ _id: req.params.listId })

      req.app.get('io').to(String(req.board._id)).emit('cardUpdated')

      res.json({ message: 'List deleted' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

module.exports = router