import request from 'request-promise'
import _ from 'lodash'
import {} from 'dotenv/config'
import sources from './sources'
import banlist from '../banlist'

async function getSource(source) {
  const options = {
    uri: `https://newsapi.org/v1/articles?source=${source.name}&sortBy=${source.sort}&apiKey=${process.env.NEWSAPI_PASS}`,
    json: true,
  }
  return request(options)
    .then(res => res.articles)
    .catch(() => {
      console.log('newsapi request failed!') // eslint-disable-line no-console
    })
}
// accept array
// return [{word: 'hurricane'}]
function sanitize(words) {
  const sanitizedWords = words
  return sanitizedWords.map(word => word.toLowerCase()
    .replace(/–|"|,|!|\?|\u2022|-|—|:|' | '|\/r\/| {2}/g, ' ')
    .replace(/\.|…|'s|[\u2018\u2019\u201A\u201B\u2032\u2035]|\|/g, ''))
    .filter(word => banlist.find(ele => ele === word) !== word)
}

function addWordFreq(words) {
  const wordFreqs = _.countBy(words)
  const arr = Object.keys(wordFreqs)
  return arr.map((word) => {
    const wordObj = {
      word,
      weight: wordFreqs[word],
    }
    return wordObj
  })
}

function parseArticles(articles) {
  const output = []
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
  return output
}

function mergeWords(arr) {
  let output = []
  arr.forEach((obj) => {
    const existing = output.filter(v => v.word === obj.word)
    if (existing.length) {
      const existingIndex = output.indexOf(existing[0])
      output[existingIndex].url = output[existingIndex].url.concat(obj.url)
      output[existingIndex].url = _.uniq(output[existingIndex].url)
      output[existingIndex].weight += obj.weight
    } else if (typeof obj.url === 'string') {
      obj.url = [obj.url]
      output.push(obj)
    }
  })
  output = _.orderBy(output, 'weight', 'desc')
  output.splice(10)
  return output
}

function getNewsAPI() {
  let output = []
  return Promise.all(sources.map(async source => getSource(source).then((articles) => {
    let words = parseArticles(articles)
    words = _.flatten(words)
    output.push(...words)
  })))
    .then(() => {
      output = mergeWords(output)
      // console.log(output)
      return output
    })
    .catch((err) => {
      console.log('issue:', err.message)
    })
}

function combineCommon(array) {
  let arr = array
  let dictionary = {}
  for (let a = 0; a < arr.length; a += 1) {
    let A = arr[a]
    if (dictionary[A] === undefined) {
      dictionary[A] = []
    }
    dictionary[A].push(arr[a + 1])
  }
  let res = []
  for (let index = 0; index < arr.length; index += 1) {
    let element = arr[index]
    let pass = false
    if (typeof dictionary[element] !== 'undefined' && dictionary[element].length > 1) {
      if (dictionary[element]
        .some((a) => {
          return a !== dictionary[element][0]
        }) === false) {
        pass = true
      }
    }
    if (pass) {
      res.push(`${arr[index]} ${dictionary[element][0]}`)
      index += 1
    } else {
      res.push(arr[index])
    }
  }
  return res
}

export default getNewsAPI
