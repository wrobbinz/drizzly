import request from 'request-promise'
import { flattenDeep } from 'lodash'
import {} from 'dotenv/config'
import sources from './sources'
import { sanitize, getWordFreq, mergeDuplicates } from '../util'


async function getSource(source) {
  let res
  try {
    res = await request({
      uri: `https://reddit.com/r/${source.name}.json`,
      json: true,
    })
  } catch (err) {
    console.log(`Error: Failed to get ${source.name}`, err.message) // eslint-disable-line no-console
  }
  // Filter out stickied posts
  res = res.data.children.filter(article => article.data.stickied === false)
  return res
}

async function getReddit() {
  let res
  try {
    res = await Promise.all(sources.map(async (src) => {
      const output = []
      const articles = await getSource(src)
      articles.forEach((article) => {
        const source = {
          title: article.data.title,
          description: '',
          url: article.data.url,
          image: '',
          date: article.data.created_utc,
        }
        let words = sanitize(`${article.data.title}`.split(' '))
        words = words.map(word => ({
          text: word,
          value: getWordFreq(words, word),
          sources: [source],
        }))
        output.push(words)
      })
      return output
    }))
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
  return mergeDuplicates(flattenDeep(res))
}

export default getReddit
