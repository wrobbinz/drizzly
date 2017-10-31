import { countBy, flattenDeep, uniq, orderBy } from 'lodash'
import banlist from './banlist'

function sanitize(words) {
  const sanitizedWords = words
  return sanitizedWords.map(word => word.trim()
    .toLowerCase()
    .replace(/–|"|,|!|\?|\u2022|-|—|:|' | '|\/r\/| {2}/g, ' ')
    .replace(/\.|…|'s|'|(|)|\[|\]|\||[\u2018\u2019\u201A\u201B\u2032\u2035]|\|/g, ''))
    .filter(word => banlist.find(ele => ele === word) !== word)
}

function getWordFreq(words, word) {
  return countBy(words)[word]
}

function mergeDuplicates(arr) {
  const words = flattenDeep(arr)
  let output = []
  words.forEach((object) => {
    const obj = object
    const existing = output.filter(v => v.text === obj.text)
    if (existing.length) {
      const existingIndex = output.indexOf(existing[0])
      output[existingIndex].sources = output[existingIndex].sources.concat(obj.sources)
      output[existingIndex].sources = uniq(output[existingIndex].sources)
      output[existingIndex].value += obj.value
    } else {
      output.push(obj)
    }
  })
  output = orderBy(output, 'value', 'desc')
  output = flattenDeep(output)
  return output
}

export { sanitize, getWordFreq, mergeDuplicates }
