import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import newsRoutes from './routes/news'
import main from './main'


const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.use(bodyParser.json())

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
