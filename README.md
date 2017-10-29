# 🌧 Drizzly API

Drizzly is pretty simple. It aggregates news/articles/posts from all sorts of internet sources, and tries to determine what the hell is happening right now. Currently, that involves scraping all available sources, determining word prevalence, then sorting and assigning by weighted value.

## News

The News object provides all relevant information about a currently trending word on the internet.

### Attributes

| Value | Type | Description
|---: | --- | --- |
| `_id` | number |A unique ID indicating the news object's rank (The news of `_id: 1` is the most popular).
| `text` | string | The word that is trending.
| `value` | number | An integer representing the word's trending score. Currently this is determined by the number of occurences counted in all sources.
| `url` | array | A list of urls (string) from which the word has been found.

### Retrieve a News Object `GET` `/api/v1/news/:id`

Retrieves a single news object.

#### Request

`GET` `/api/v1/news/9`

#### Response

```json
{
    "status": 200,
    "message": "Retrieved news by ID: 9",
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

### List all News `GET` `/api/v1/news/`

Retrieves an array of news objects. Drizzly returns 200 words by default. You can use the `limit` query parameter to retrieve from 1 to 1000 words.

#### Request

`GET` `/api/v1/news?limit=2`

#### Response

```json
{
    "status": 200,
    "message": "Retrieved all news successfully",
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
