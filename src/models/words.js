import mongoose from 'mongoose'


const wordsSchema = new mongoose.Schema({
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
})

const Words = mongoose.model('Words', wordsSchema)

module.exports = Words
