import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import wordsRoutes from './routes/words'
import createCloud from './main'


const app = express()
const CLOUD_INTERVAL = 10000
// Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
// Routes
app.get('/', (req, res) => {
  res.send('drizzly news!')
})
app.use('/api/v1/words', wordsRoutes)
// 404
app.use((req, res, next) => {
  const err = new Error('Not Found (404)')
  err.status = 404
  next(err)
})
// Create Cloud
setInterval(createCloud, CLOUD_INTERVAL)

export default app
