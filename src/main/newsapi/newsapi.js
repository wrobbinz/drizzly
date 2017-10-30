import request from 'request-promise'
import { flatten } from 'lodash'
import {} from 'dotenv/config'
import sources from './sources'
import { sanitize, addWordFreq, mergeDuplicates } from '../util'


async function getSource(source) {
  let res
  try {
    res = await request({
      uri: `https://newsapi.org/v1/articles?source=${source.name}&sortBy=${source.sort}&apiKey=${process.env.NEWSAPI_PASS}`,
      json: true,
    })
  } catch (err) {
    console.log(`Error: Failed to get ${source.name}`, err.message) // eslint-disable-line no-console
  }
  return res.articles
}

function parseArticles(articles) {
  let output = []
  articles.forEach((article) => {
    const url = article.url
    let words = `${article.title} ${article.description}`.split(' ')
    words = sanitize(words)
    words = addWordFreq(words)
    words.map((word) => {
      const obj = word
      obj.url = url
      return obj
    })
    output.push(words)
  })
  output = flatten(output)
  return output
}

async function getNewsAPI() {
  let words
  try {
    words = await Promise.all(sources.map(async source => parseArticles(await getSource(source))))
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
  words = mergeDuplicates(words)
  return words
}

export default getNewsAPI
