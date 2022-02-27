/* eslint-disable no-unused-vars */
import mongoose from 'mongoose'

export type MongooseConnection = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// eslint-disable-next-line no-var
	var mongoose: MongooseConnection

	namespace NodeJS {
		interface ProcessEnv {
			MONGODB_URI?: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
		}
	}
}
