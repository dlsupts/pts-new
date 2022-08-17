import mongoose from 'mongoose'
import { MongooseConnection } from '../global'
import logger from './logger'

const MONGODB_URI = process.env.MONGODB_URI

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: MongooseConnection = <MongooseConnection>global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		}

		if (!MONGODB_URI) {
			throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
		}

		cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => mongoose)
	}

	cached.conn = await cached.promise
	logger.debug('ESTABLISHED CONNECTION')
	return cached.conn
}

export default dbConnect