import db from '../models/'
import getNewsAPI from './newsapi/newsapi'


const INTERVAL = 10000
const CLOUD_SIZE = 1000

async function createCloud() {
  try {
    const payload = await getNewsAPI()
    payload.splice(CLOUD_SIZE)
    payload.forEach((obj, idx) => {
      const word = obj
      word['_id'] = idx + 1
      db.Words.findByIdAndUpdate(idx)
    })
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
}

export default createCloud
setInterval(createCloud, INTERVAL)
