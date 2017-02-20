import { version } 		from '../../../package.json'
import { Router } 		from 'express'
import https 			from 'https'
import bodyParser 		from 'body-parser'
import rp 				from 'request-promise'
import _ 				from 'underscore'


// global variables
const apiKey		= "cf2cec0cee9544839c4ade13a131f33a"
const newsApiSource	= ["ars-technica", "associated-press", "bbc-news", "bbc-sport", "bloomberg", "business-insider", "cnbc", "cnn", "engadget", "entertainment-weekly", "espn", "financial-times", "google-news", "hacker-news", "national-geographic", "new-scientist", "newsweek", "reddit-r-all", "reuters", "techcrunch", "the-economist", "the-guardian-uk", "the-huffington-post", "the-new-york-times", "the-wall-street-journal", "the-washington-post", "time", "usa-today"] 
const newsSection	= ["business", "entertainment", "general", "politics", "science", "sports", "technology"]
const filteredWord	= ["it", "be", "if", "in", "then", "than", "a", "but", "or", "and", "why", "on", "out", "is", "at", "to", "the", "are", "for", "of", "as"]
let rank			= "top"
let sourceString 		= ""


// router
export default ({ config }) => {
  let news = Router()
  news.get('/', function(req, res){
  	var check = getSources()
		res.json({ check })
	})

  return news
}

// create list of words (sourceString) by pulling news data from various sources
function getSources() {
	return getNewsApi()

}
// NEWS API
// GET top 10 news article titles from News API (news sources are determined by the values of newsApiSource array)
function getNewsApi() {
  var finished = _.after(newsApiSource.length, processWordBank)
	for(var i = 0; i < newsApiSource.length; i++) {
    let options = {
      uri: 'https://newsapi.org/v1/articles?source=' + newsApiSource[i] + '&sortBy=' + rank + '&apiKey=' + apiKey,
      json: true
    }
    rp(options)
    .then(function (res) {
      let articles = res.articles // grab article objects from the response
      let articleTitles = " " + _.pluck(articles, 'title') // extract title of each news article
      sourceString += " " + articleTitles // add all titles to the word bank
      finished() // this async task has finished
    })
    .catch(function (err) {
      console.log(err)
    })
	}
  return finished
}

// analyse word bank for patterns/trends
function processWordBank(){
	var sourceArray = refineSource(sourceString)
  sourceArray = combineCommon(sourceArray)
  sourceArray = getWordFreq(sourceArray)
  var obj = sortToObject(sourceArray[0], sourceArray[1])
  console.log(obj)
  return obj
}

// clean up list of words (remove unwanted chars, toLowerCase, remove undefined) and return it in array form
function refineSource(string){
	var arr = string.replace(/,/g, " ") // remove ",", replace with " "
		.replace(/\./g, "") // remove ".", replace with " "
		.replace(/!/g, " ") 
		.replace(/\?/g, " ")
		.replace(/\u2022/g, " ") // remove "•", replace with " "
		.replace(/-/g, " ") // remove " - ", replace with " "
		.replace(/—/g, " ")
		.replace(/:/g, " ") // remove ":", replace with " "
		.replace(/' /g, " ") // remove "' ", replace with " " (i.e. unecessary single quotes)
		.replace(/ '/g, " ") // remove " '", replace with " " (i.e. unecessary single quotes)
		.replace(/'s/g, "")
		.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "") // remove left quote, replace with " "
		.replace(/\|/g, "")
		.replace(/  /g, " ") // Remove "  ", replace with " "
		.replace(/\/r\//g, " ") // remove "/r/", replace with " "  (reddit)
    .split(' ')
  // convert all words to lowercase
  for(var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].toLowerCase()
  }
  // remove all unwanted words using the filteredWord array
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < filteredWord.length; j++) {
      if (arr[i] == filteredWord[j]) {
        arr[i] = ''
      }
    }
  }
  // remove any items that are just empty spaces
  arr.clean('')
  return arr
	
}

// find array elements that appear together more than once, if so, combine them into single element
function combineCommon(arr) {
  var dictionary = {};
  for (var a = 0; a < arr.length; a++) {
    var A = arr[a];
    if (dictionary[A] == undefined) {
      dictionary[A] = [];
    }
    dictionary[A].push(arr[a + 1]);
  }
  var res = [];
  arr.clean('')
  arr.clean(undefined)
  for (var index = 0; index < arr.length; index++) {
    var element = arr[index];
    var pass = false;
    if (typeof dictionary[element] !== 'undefined' && dictionary[element].length > 1) {
      if (dictionary[element]
        .some(function(a) {
          return a != dictionary[element][0];
        }) == false) {
        pass = true;
      }
    }
    if (pass) {
      res.push(arr[index] + " " + dictionary[element][0]);
      index++;
    } else {
      res.push(arr[index]);
    }
  }
  return res;
}


function getWordFreq(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

// myArray = [{"text":"First","size":15},{"text":"Not","size":29}]
function sortToObject(words, count) {
  var obj = []
  for (var i = 0; i < words.length; i++){
    var element = {}
    element.text = words[i]
    element.size = count[i]
    obj.push(element)
  }
  obj.sort(function(a,b){
      return b.size - a.size;
      }
  );
  JSON.stringify(obj)
  return obj
}

// utility
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};