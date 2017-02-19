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
let finished		= _.after(newsApiSource.length, processWordBank)
let wordBank 		= ""


// router
export default ({ config }) => {
  let news = Router()
  news.get('/', function(req, res){
  		getSources()
		res.json({ version })
	})

  return news
}

// create list of words (wordBank) by pulling news data from various sources
function getSousrces() {
	getAllNewsApi()

}
// NEWS API
// GET top 10 news article titles from News API (news sources are determined by the values of newsApiSource array)
function getAllNewsApi() {
	for(var i = 0; i < newsApiSource.length; i++) {
		getNewsApi(i)
	}
}
// add article titles  of specified article (newsApiSource[i]) to wordBank
function getNewsApi(i){
	let options = {
			uri: 'https://newsapi.org/v1/articles?source=' + newsApiSource[i] + '&sortBy=' + rank + '&apiKey=' + apiKey,
			json: true
		}
	return rp(options)
		.then(function (res) {
			let articles = res.articles // grab article objects from the response
			let articleTitles = " " + _.pluck(articles, 'title') // extract title of each news article
			wordBank += " " + articleTitles // add all titles to the word bank
			finished() // this async task has finished
		})
		.catch(function (err) {
			console.log(err)
		})
}
// analyse word bank for patterns/trends
function processWordBank(){
	var wordBankArray = refineWordBank()
  wordBankArray = combineCommon(wordBankArray)
  var wordCloud = getWordFreq(wordBankArray)
  
  console.log(wordCloud)
}

// clean up list of words (remove unwanted chars, toLowerCase, remove undefined) and return it in array form
function refineWordBank(){
	wordBank = wordBank.replace(/,/g, " ") // remove ",", replace with " "
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
  for(var i = 0; i < wordBank.length; i++) {
    wordBank[i] = wordBank[i].toLowerCase()
  }
  for (var i = 0; i < wordBank.length; i++) {
    for (var j = 0; j < filteredWord.length; j++) {
      if (wordBank[i] == filteredWord[j]) {
        wordBank[i] = ''
      }
    }
  }
  wordBank.clean('')
  return wordBank
	
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
  var string = arr.toString().replace(/,/g , " ")
  return string.replace(/[.]/g, '')
    .split(/\s/)
    .reduce((map, word) =>
      Object.assign(map, {
        [word]: (map[word])
          ? map[word] + 1
          : 1,
      }),
      {}
    );
}



// var wordPairs = []
// var len = oFullResponse.results.length;
// for (var i = 0; i < len; i++) {
//     arr.push({
//         key: oFullResponse.results[i].label,
//         sortable: true,
//         resizeable: true
//     });
// }

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