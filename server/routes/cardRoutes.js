const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Card = require('../models/Card')
const List = require('../models/List')
const authMiddleware = require('../middleware/authMiddleware')
const {
  requireBoardAccess,
  boardIdOfList,
  boardIdOfCard
} = require('../middleware/boardAccess')

router.post(
  '/',
  authMiddleware,
  requireBoardAccess(boardIdOfList((req) => req.body.list)),
  async (req, res) => {
    try {
      const text = typeof req.body.text === 'string' ? req.body.text.trim() : ''
      if (!text || text.length > 500) {
        return res.status(400).json({ error: 'Text is required (max 500 characters)' })
      }

      const newCard = new Card({ text, list: req.body.list })
      const savedCard = await newCard.save()

      // Board ke baaki users ko live update
      req.app.get('io').to(String(req.board._id)).emit('cardUpdated')

      res.status(201).json(savedCard)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.get(
  '/:listId',
  authMiddleware,
  requireBoardAccess(boardIdOfList((req) => req.params.listId)),
  async (req, res) => {
    try {
      const cards = await Card.find({ list: req.params.listId })
      res.json(cards)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.put(
  '/:cardId',
  authMiddleware,
  requireBoardAccess(boardIdOfCard((req) => req.params.cardId)),
  async (req, res) => {
    try {
      // Target list usi board ki honi chahiye jis board par user ka access hai
      if (!mongoose.isValidObjectId(req.body.list)) {
        return res.status(400).json({ error: 'Valid target list is required' })
      }

      const targetList = await List.findOne({ _id: req.body.list, board: req.board._id })
      if (!targetList) {
        return res.status(400).json({ error: 'Target list not found on this board' })
      }

      const updatedCard = await Card.findByIdAndUpdate(
        req.params.cardId,
        { list: targetList._id },
        { returnDocument: 'after' }
      )

      // boardId ab client ki body se nahi, verified board se aa raha hai
      const io = req.app.get('io')
      io.to(String(req.board._id)).emit('cardUpdated')

      res.json(updatedCard)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

module.exports = router