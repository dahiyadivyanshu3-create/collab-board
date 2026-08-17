const express = require('express')
const router = express.Router()
const List = require('../models/List')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newList = new List({
      title: req.body.title,
      board: req.body.board
    })

    const savedList = await newList.save()
    res.json(savedList)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:boardId', authMiddleware, async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId })
    res.json(lists)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router