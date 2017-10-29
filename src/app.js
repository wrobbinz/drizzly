import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import newsRoutes from './routes/news'
import main from './main'


const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(compression())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('drizzly news!')
})
app.use('/api/v1/news', newsRoutes)
// 404
app.use((req, res, next) => {
  const err = new Error('Not Found (404)')
  err.status = 404
  next(err)
})

app.listen(6060, () => {
  console.log('port: 6060') // eslint-disable-line no-console
})

export default app
