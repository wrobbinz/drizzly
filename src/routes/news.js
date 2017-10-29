import express from 'express'
import db from '../models/'


const app = express()
const router = express.Router()

router.get('/', (req, res) => {
  db.Words.find().then((words) => {
    res.send({
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
