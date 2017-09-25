import db from '../models/'
import getNewsAPI from './newsapi/newsapi'


const INTERVAL = 8000
const CLOUD_SIZE = 200

async function createCloud() {
  return getNewsAPI().then((payload) => {
    // console.log('payload: ', payload)
    db.Words.remove().then(() => {
      db.Words.insertMany(payload).then(() => {
        console.log('sucess!')
      })
    })
  })
    .catch((err) => {
      console.log(err.message)
    })
}

setInterval(createCloud, INTERVAL)
