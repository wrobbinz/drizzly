export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	const MongoClient = require('mongodb').MongoClient
	
	MongoClient.connect('mongodb://admin:RainbowRoadNewspoint@ds157549.mlab.com:57549/newspoint', (err, database) => {
		if (err) return console.log(err)
	})
	callback()
}
