import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import User from '../../../models/user'
import dbConnect from '../../../lib/db'

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		})
	],
	session: {
		strategy: "jwt"
	},
	callbacks: {
		async signIn({ account, profile }) {
			if (account.provider === 'google' && (profile.hd == 'dlsu.edu.ph' || profile.email == 'dlsu.pts.web.service@gmail.com')) {
				let temp

				try {
					await dbConnect()
					temp = await User.findOne({ email: profile.email }).lean().exec()
				} catch (err) {
					console.log(err)
					throw new Error("A server side-error has occured!")
				}

				if (temp == null) {
					throw new Error("User unauthorized! Please contact the system administrator.")
				}

				return true
			}
			
			throw new Error('Invalid login! Make sure to use your DLSU email.')
		},
		async jwt({ token, account, profile }) {
			if (account && profile) {
				try {
					await dbConnect()
					const temp = await User.findOne({ email: profile.email }, 'userType').lean().exec()
					token.type = temp?.userType
				} catch (err) {
					console.log(err)
					throw new Error("A server side-error has occured!")
				}
			}

			return token
		},
		async session({ token, session }) {
			session.user.type = token.type
			return session
		}
	},
	pages: {
		error: '/'
	},
})
