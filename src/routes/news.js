import express from 'express'
import bodyParser from 'body-parser'
import db from '../models/'


const app = express()
const router = express.Router()
app.use(bodyParser.json())

router.get('/', (req, res) => {
  db.Words.find().then((words) => {
    res.send({
      status: 200,
      message: 'Retrieved all users successfully',
      data: words,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

export default router
