import mongoose from 'mongoose'


const wordsSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  url: {
    type: [String],
  },
})

const Words = mongoose.model('Words', wordsSchema)

module.exports = Words
