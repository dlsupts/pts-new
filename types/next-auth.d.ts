/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { role } from '.'
import { Schema } from 'mongoose'

declare module 'next-auth' {
	interface Session {
		user: {
			_id: Schema.Types.ObjectId
			type?: role
			schedule?: Schema.Types.ObjectId
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		_id: Schema.Types.ObjectId
		type?: role
		schedule?: Schema.Types.ObjectId
	}
}