import db from '../models/'
import getNewsAPI from './newsapi'
import getReddit from './reddit'
import { mergeDuplicates } from './util'


const LIMIT = 1000

async function createCloud() {
  try {
    let successes = 0
    let payload = [
      await getNewsAPI(),
      await getReddit(),
    ]
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
  } catch (err) {
    throw new Error('Failed to create Cloud')
  }
}

export default createCloud
