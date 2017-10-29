import request from 'request-promise'
import _ from 'lodash'
import {} from 'dotenv/config'
import sources from './sources'
import banlist from '../banlist'


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
// accept array
// return [{word: 'hurricane'}]
function sanitize(words) {
  const sanitizedWords = words
  return sanitizedWords.map(word => word.trim()
    .toLowerCase()
    .replace(/–|"|,|!|\?|\u2022|-|—|:|' | '|\/r\/| {2}/g, ' ')
    .replace(/\.|…|'s|'|(|)|\||[\u2018\u2019\u201A\u201B\u2032\u2035]|\|/g, ''))
    .filter(word => banlist.find(ele => ele === word) !== word)
}

function addWordFreq(words) {
  const wordFreqs = _.countBy(words)
  const arr = Object.keys(wordFreqs)
  return arr.map((word) => {
    const wordObj = {
      text: word,
      value: wordFreqs[word],
    }
    return wordObj
  })
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
  output = _.flatten(output)
  return output
}

function mergeDuplicates(arr) {
  const words = _.flatten(arr)
  let output = []
  words.forEach((object) => {
    const obj = object
    const existing = output.filter(v => v.text === obj.text)
    if (existing.length) {
      const existingIndex = output.indexOf(existing[0])
      output[existingIndex].url = output[existingIndex].url.concat(obj.url)
      output[existingIndex].url = _.uniq(output[existingIndex].url)
      output[existingIndex].value += obj.value
    } else if (typeof obj.url === 'string') {
      obj.url = [obj.url]
      output.push(obj)
    }
  })
  output = _.orderBy(output, 'value', 'desc')
  output = _.flatten(output)
  return output
}

async function getNewsAPI() {
  let output
  try {
    output = await Promise.all(sources.map(async (source) => {
      const articles = await getSource(source)
      const words = parseArticles(articles)
      return words
    }))
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
  output = mergeDuplicates(output)
  return output
}

export default getNewsAPI
