import db from '../models/'
import getNewsAPI from './newsapi/newsapi'
import getReddit from './reddit/reddit'
import { mergeDuplicates } from './util'


const INTERVAL = 10000
const CLOUD_SIZE = 1000

async function createCloud() {
  let payload
  try {
    const newsAPI = await getNewsAPI()
    const reddit = await getReddit()
    payload = newsAPI.concat(reddit)
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
  payload = mergeDuplicates(payload)
  payload.splice(CLOUD_SIZE)
  payload.forEach((obj, idx) => {
    const word = obj
    const index = idx + 1
    db.Words.findByIdAndUpdate(index, word, (err, doc) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(doc)
      }
    })
  })
}

export default createCloud
setInterval(createCloud, INTERVAL)
