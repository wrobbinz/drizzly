import { countBy, flatten, uniq, orderBy } from 'lodash'
import banlist from './banlist'

function sanitize(words) {
  const sanitizedWords = words
  return sanitizedWords.map(word => word.trim()
    .toLowerCase()
    .replace(/–|"|,|!|\?|\u2022|-|—|:|' | '|\/r\/| {2}/g, ' ')
    .replace(/\.|…|'s|'|(|)|\[|\]|\||[\u2018\u2019\u201A\u201B\u2032\u2035]|\|/g, ''))
    .filter(word => banlist.find(ele => ele === word) !== word)
}

function addWordFreq(words) {
  const wordFreqs = countBy(words)
  const arr = Object.keys(wordFreqs)
  return arr.map((word) => {
    const wordObj = {
      text: word,
      value: wordFreqs[word],
    }
    return wordObj
  })
}

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
    } else if (typeof obj.url === 'string') {
      obj.url = [obj.url]
      output.push(obj)
    }
  })
  output = orderBy(output, 'value', 'desc')
  output = flatten(output)
  return output
}

export { sanitize, addWordFreq, mergeDuplicates }
