import request from 'request-promise'
import { flattenDeep } from 'lodash'
import {} from 'dotenv/config'
import sources from './sources'
import { sanitize, getWordFreq, mergeDuplicates } from '../util'


async function getSource(source) {
  let res
  try {
    res = await request({
      uri: `https://newsapi.org/v1/articles?source=${source.name}&sortBy=${source.sort}&apiKey=${process.env.NEWSAPI_PASS}`,
      json: true,
    })
  } catch (err) {
    throw new Error(`Failed request for [${source.name}] (News API)`)
  }

  res = res.articles
  return res
}

async function getNewsAPI() {
  let res
  try {
    res = await Promise.all(sources.map(async (src) => {
      const output = []
      const articles = await getSource(src)
      articles.forEach((article) => {
        const source = {
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          date: article.publishedAt,
        }
        let words = sanitize(`${article.title} ${article.description}`.split(' '))
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
    throw new Error('Failed to parse Reddit source')
  }
  return mergeDuplicates(flattenDeep(res))
}

export default getNewsAPI
