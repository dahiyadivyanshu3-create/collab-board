const mongoose = require('mongoose')
const Board = require('../models/Board')
const List = require('../models/List')
const Card = require('../models/Card')

// Ek hi jagah jahan decide hota hai "ye user is board ko access kar sakta hai ya nahi".
// Aage jab members add karoge, sirf yahi query badlegi:
//   { _id: boardId, $or: [{ owner: userId }, { members: userId }] }
async function findAccessibleBoard(boardId, userId) {
  if (!mongoose.isValidObjectId(boardId)) return null
  return Board.findOne({ _id: boardId, owner: userId })
}

// getBoardId(req) wo board id return kare jiske andar ye request kaam kar rahi hai.
// Access mile to req.board set hota hai, nahi to 404
// (404 isliye, taaki bahar se pata na chale ki board exist karta hai ya nahi).
function requireBoardAccess(getBoardId) {
  return async (req, res, next) => {
    try {
      const boardId = await getBoardId(req)
      const board = await findAccessibleBoard(boardId, req.userId)

      if (!board) {
        return res.status(404).json({ error: 'Not found' })
      }

      req.board = board
      next()
    } catch (error) {
      next(error)
    }
  }
}

// Resolvers: request se board id nikalne ke tareeke
const boardIdFromParam = (name) => (req) => req.params[name]
const boardIdFromBody = (field) => (req) => req.body[field]

const boardIdOfList = (getListId) => async (req) => {
  const listId = getListId(req)
  if (!mongoose.isValidObjectId(listId)) return null
  const list = await List.findById(listId).select('board')
  return list ? list.board : null
}

const boardIdOfCard = (getCardId) => async (req) => {
  const cardId = getCardId(req)
  if (!mongoose.isValidObjectId(cardId)) return null
  const card = await Card.findById(cardId).select('list')
  if (!card) return null
  const list = await List.findById(card.list).select('board')
  return list ? list.board : null
}

module.exports = {
  requireBoardAccess,
  boardIdFromParam,
  boardIdFromBody,
  boardIdOfList,
  boardIdOfCard
}