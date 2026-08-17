const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  }
}, { timestamps: true })

const Card = mongoose.model('Card', cardSchema)

module.exports = Card