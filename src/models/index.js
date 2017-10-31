import mongoose from 'mongoose'


mongoose.set('debug', false)
mongoose.connect('mongodb://localhost/drizzly', { useMongoClient: true })
mongoose.Promise = Promise

module.exports.Words = require('./words')
