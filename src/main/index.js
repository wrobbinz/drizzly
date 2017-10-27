import db from '../models/'
import getNewsAPI from './newsapi/newsapi'


const INTERVAL = 10000
const CLOUD_SIZE = 20

async function createCloud() {
  try {
    const payload = await getNewsAPI()
    payload.splice(CLOUD_SIZE)
    db.Words.remove({}, () => {
      db.Words.insertMany(payload, () => {
      })
    })
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
}

export default createCloud
setInterval(createCloud, INTERVAL)
