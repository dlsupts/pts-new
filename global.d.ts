/* eslint-disable no-unused-vars */
import { LOG_LEVEL } from '@models/log'
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
			MONGODB_URI: string
			GOOGLE_CLIENT_ID: string
			GOOGLE_CLIENT_SECRET: string
			NEXT_PUBLIC_ADMIN_EMAIL: string
			MAIL_PASS: string
			LOG_LEVEL?: LOG_LEVEL
			NEXT_PUBLIC_VERCEL_URL: string
			NEXTAUTH_SECRET: string
		}
	}
}
