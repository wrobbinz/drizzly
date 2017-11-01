import db from '../models/'
import getNewsAPI from './newsapi/newsapi'
import getReddit from './reddit/reddit'
import { mergeDuplicates } from './util'


const INTERVAL = 10000
const LIMIT = 1000

async function createCloud() {
  let payload
  let successes = 0
  try {
    payload = [
      await getNewsAPI(),
      await getReddit(),
    ]
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
  payload = mergeDuplicates(payload)
  payload.splice(LIMIT)
  payload.forEach((obj, idx) => {
    const word = obj
    db.Words.findByIdAndUpdate(idx + 1, word, { upsert: true }, (err) => {
      if (err) {
        console.log(err.message) // eslint-disable-line no-console
      } else {
        successes += 1
        if (successes === LIMIT) {
          console.log('DB Update Sucessful!') // eslint-disable-line no-console
        }
      }
    })
  })
}

export default createCloud
setInterval(createCloud, INTERVAL)
