const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Owner ke alawa jin users ko board par access diya gaya hai
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })

boardSchema.index({ owner: 1 })
boardSchema.index({ members: 1 })

const Board = mongoose.model('Board', boardSchema)

module.exports = Board