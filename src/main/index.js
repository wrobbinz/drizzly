import { flatten, orderBy, uniq } from 'lodash'
import db from '../models/'
import getNewsAPI from './newsapi/newsapi'
import getReddit from './reddit/reddit'


const INTERVAL = 10000
const CLOUD_SIZE = 1000

function mergeDuplicates(arr) {
  const words = flatten(arr)
  let output = []
  words.forEach((object) => {
    const obj = object
    const existing = output.filter(v => v.text === obj.text)

    if (existing.length) {
      const existingIndex = output.indexOf(existing[0])
      output[existingIndex].url = output[existingIndex].url.concat(obj.url)
      output[existingIndex].url = uniq(output[existingIndex].url)
      output[existingIndex].value += obj.value
    } else {
      output.push(obj)
    }
  })
  output = orderBy(output, 'value', 'desc')
  output = flatten(output)
  return output
}

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
