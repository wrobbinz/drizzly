import mongoose from 'mongoose'


const wordsSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  url: {
    type: [String],
  },
}, { _id: false })

const Words = mongoose.model('Words', wordsSchema)

module.exports = Words
