import express from 'express'
import db from '../models/'


const app = express()
const router = express.Router()
app.use(express.json())

const LIMIT = 25

router.get('/', (req, res) => {
  if (req.query.limit > 1000) {
    res.status(400).send({
      status: 400,
      message: `Error: Limit of ${req.query.limit} is too high (max is 1000)`,
    })
  }
  const limit = typeof req.query.limit !== 'undefined' ? req.query.limit : LIMIT
  db.Words.find({ _id: { $lte: limit } }).then((words) => {
    res.status(200).send({
      status: 200,
      message: 'Retrieved all news successfully',
      count: words.length,
      data: words,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

router.get('/:id', (req, res) => {
  db.Words.findById(req.params.id).then((word) => {
    res.status(200).send({
      status: 200,
      message: `Retrieved news by ID: ${req.params.id}`,
      count: 1,
      data: word,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

export default router
