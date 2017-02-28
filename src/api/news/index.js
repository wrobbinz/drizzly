import { Router } 		                  from 'express'
import https 			                      from 'https'
import bodyParser 		                  from 'body-parser'
import rp 				                      from 'request-promise'
import _                                from 'lodash'
import { newsApiSource, filteredWord }  from './modules/sources'
import db                               from '../../queries'

const INTERVAL = 30000

// router
export default ({ config }) => {
  let news = Router()
  news.get('/', db.getAllNews)

  news.post('/', (req, res) => {
    createAllNews()
    res.json({
      status: 'success',
      message: 'Updated AllNews'
    })
  })
  return news
}

let createAllNews = (req, res) => {
  console.log('All News Updated @ Interval: ', INTERVAL/1000, ' seconds')
  const cloudObj = getSources()
  cloudObj.then((apiResponses) => {
    // Flatten the array
    // From: [['source1article1', 'source1article2'], ['source2article1'], ...]
    // To: ['source1article1', 'source1article2', 'source2article1', ...]
    const articles = [].concat.apply([], apiResponses)
    // Pass the articles as parameter
    const wordCloud = processWordBank(articles)
    // Respond with the processed object
    //res.json( wordCloud )
    db.updateAllNews(wordCloud)
  })
}


// create list of words (sourceString) by pulling news data from various sources
var getSources = () => {
	return getNewsApi()

}
// NEWS API
// GET top 10 news article titles from News API (news sources are determined by the values of newsApiSource array)
var getNewsApi = () => {
  // Each element is a request promise
  const apiCalls = newsApiSource.map((source) => {
    let options = {
      uri: 'https://newsapi.org/v1/articles?source=' + source.name + '&sortBy=' + source.sort + '&apiKey=' + process.env.NEWSAPI_PASS,
      json: true
    }
    return rp(options)
      .then((res) => {
        let articles = res.articles
        // grab the url of each article. each url needs to be associated with a word
        let articleUrls = _.map(articles, 'url')
        let articleWords = _.map(articles, 'title') + _.map(articles, 'description')
        // The promise is fulfilled with the articleWords
        return articleWords
      })
      .catch((err) => {
        console.log('Warning: NewsApi request for [', source.name, '] failed...')
      })
  })
  // Return the promise that is fulfilled with all request values
  return Promise.all(apiCalls)
}


// analyse word bank for patterns/trends
var processWordBank = (articles) => {
  articles = articles.join() // combine all article titles into one array element
	let sourceArray = refineSource(articles) // word cleanup
  sourceArray = combineCommon(sourceArray) // combine all words that appear more than once ex: "white house", "bernie sanders"
  sourceArray = getWordFreq(sourceArray)
  var obj = sortToObject(sourceArray[0], sourceArray[1])
  obj = obj.slice(0, 200)
  obj = normalizeSize(obj)
  return obj
}

var normalizeSize = (arr) => {
      let ratio = arr[0].size / 220, l = arr.length, i

  for (i = 0; i < l; i++) {
      arr[i].size = Math.round(arr[i].size / ratio);
  }
  return arr
}


// clean up list of words (remove unwanted chars, toLowerCase, remove undefined) and return it in array form
var refineSource = (str) => {
	var arr = str.replace(/–|"|,|!|\?|\u2022|-|—|:|' | '|\/r\/|  /g, ' ') // remove most special chars, replace with " "
		.replace(/\.|…|'s|[\u2018\u2019\u201A\u201B\u2032\u2035]|\|/g, '') // remove specific chars
    .split(' ') // convert to array
    .map((x) => x.toLowerCase()) // convert all elements to lowercase
  // remove all unwanted words using the filteredWord array
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < filteredWord.length; j++) {
      if (arr[i] == filteredWord[j]) {
        arr[i] = ''
      }
    }
  }
  // remove any items that are just empty spaces
  arr.clean('') // remove any elements that are null
  return arr
	
}

// find array elements that appear together more than once, if so, combine them into single element
var combineCommon = (arr) => {
  var dictionary = {}
  for (var a = 0; a < arr.length; a++) {
    var A = arr[a]
    if (dictionary[A] == undefined) {
      dictionary[A] = []
    }
    dictionary[A].push(arr[a + 1])
  }
  var res = [];
  arr.clean('')
  arr.clean(undefined)
  for (var index = 0; index < arr.length; index++) {
    var element = arr[index]
    var pass = false
    if (typeof dictionary[element] !== 'undefined' && dictionary[element].length > 1) {
      if (dictionary[element]
        .some((a) => {
          return a != dictionary[element][0]
        }) == false) {
        pass = true
      }
    }
    if (pass) {
      res.push(arr[index] + " " + dictionary[element][0])
      index++
    } else {
      res.push(arr[index])
    }
  }
  return res
}


var getWordFreq = (arr) => {
    var a = [], b = [], prev;

    arr.sort()
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i])
            b.push(1)
        } else {
            b[b.length-1]++
        }
        prev = arr[i]
    }

    return [a, b]
}

var sortToObject = (words, count) => {
  var obj = []
  for (var i = 0; i < words.length; i++){
    var element = {}
    element.text = words[i]
    count[i] = count[i]*2
    element.size = count[i]
    obj.push(element)
  }
  obj.sort((a,b) =>{
      return b.size - a.size
      }
  )
  // assign each pair an id (1 - ?)
  for (var i = 0; i < obj.length; i++){
    obj[i].id = i + 1
  }
  return obj
}

// utility
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1)
      i--
    }
  }
  return this
}
setInterval(createAllNews, INTERVAL)