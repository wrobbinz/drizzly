# 🌧 Drizzly API

Table of Contents

- [Introduction](#introduction)
- [How it works](#how-it-works)
- [Words](#news)
  - [Retrieve a Word Object](#retrieve-a-word-object-get-apiv1wordsid)
  - [List all Words](#list-all-words-get-apiv1news)

## Introduction

Drizzly is pretty simple. It aggregates news/articles/posts from all sorts of internet sources, and tries to determine what the hell is happening right now. Currently, that involves scraping all available sources, determining word prevalence, then sorting and assigning by weighted value.

## How it Works

### Stack

- Ubuntu 16.04
- Node/Express
- MongoDB/Mongoose
- Mocha/Chai

### Logic

- Get news/articles/posts from all sources
- Sanitize responses into alphanumerical words
- Determine prevalence/weight
- Assign URLs to each object
- Merge duplicate occurences
- Upload to DB

## Words

The Word object provides all relevant information about a currently trending word on the internet.

### Attributes

| Value | Type | Description
|---: | --- | --- |
| `_id` | number |A unique ID indicating the word object's rank (The word of `_id: 1` is the most popular).
| `text` | string | The word that is trending.
| `value` | number | An integer representing the word's trending score. Currently this is determined by the number of occurences counted in all sources.
| `url` | array | A list of urls (string) from which the word has been found.

### Retrieve a Word Object `GET` `/api/v1/words/:id`

Retrieves a single words object.

#### Request

`GET` `/api/v1/words/9`

#### Response

```json
{
    "status": 200,
    "message": "Retrieved word by ID: 9",
    "count": 1,
    "data": {
        "_id": 9,
        "text": "lizards",
        "value": 15,
        "url": [
            "https://times.com/lizards-run-rampant-along-bay-bridge/",
            "http://lizarddaily.com/10-steps-for-better-skin"
        ]
    }
}
```

### List all Words `GET` `/api/v1/words/`

Retrieves an array of word objects. Drizzly returns 25 words by default. You can use the `limit` query parameter to retrieve from 1 to 1000 words.

#### Request

`GET` `/api/v1/words?limit=2`

#### Response

```json
{
    "status": 200,
    "message": "Retrieved all words successfully",
    "count": 2,
    "data": [
        {
            "_id": 1,
            "__v": 0,
            "text": "dog",
            "value": 44,
            "url": [
                "https://sciencedaily.org/cancer-fighting-agents-found-in-dog-drool",
                "http://newyorktimes.com/whos-a-good-boy"
            ]
        },
        {
            "_id": 2,
            "__v": 0,
            "text": "cat",
            "value": 39,
            "url": [
                "https://economist.com/tax-cuts-have-stock-market-purring"
            ]
        }
    ]
}
```
