import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import db from '../models/'


mongoose.Promise = Promise
