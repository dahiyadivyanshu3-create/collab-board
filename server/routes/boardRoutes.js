const express = require('express')
const router = express.Router()
const Board = require('../models/Board')
const User = require('../models/User')
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

// Jo boards user ke apne hain + jin par use member banaya gaya hai
router.get('/', authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.userId }, { members: req.userId }]
    })
    res.json(boards)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', authMiddleware, requireBoardAccess(boardIdFromParam('id')), async (req, res) => {
  try {
    // populate se pehle check karo, kyunki populate ke baad owner ek object ban jaata hai
    const isOwner = String(req.board.owner) === String(req.userId)

    await req.board.populate([
      { path: 'owner', select: 'name' },
      { path: 'members', select: 'name' }
    ])

    res.json({ ...req.board.toObject(), isOwner })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Sirf owner kisi ko email se invite kar sakta hai
router.post('/:id/members', authMiddleware, requireBoardAccess(boardIdFromParam('id')), async (req, res) => {
  try {
    if (String(req.board.owner) !== String(req.userId)) {
      return res.status(403).json({ error: 'Only the board owner can invite members' })
    }

    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'No user found with that email' })
    }

    const alreadyOnBoard =
      String(user._id) === String(req.board.owner) ||
      req.board.members.some((m) => String(m) === String(user._id))
    if (alreadyOnBoard) {
      return res.status(409).json({ error: 'This user is already on the board' })
    }

    await Board.updateOne({ _id: req.board._id }, { $addToSet: { members: user._id } })
    res.status(201).json({ message: 'Member added' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router