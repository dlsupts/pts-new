/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { role } from '.'
import { Schema } from 'mongoose'

declare module 'next-auth' {
	interface Session {
		user: {
			type?: role
			schedule?: Schema.Types.ObjectId
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		type?: role
		schedule?: Schema.Types.ObjectId
	}
}