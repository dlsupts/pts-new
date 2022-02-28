import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import User from '../../../models/user'

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		})
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account.provider === 'google' && profile.hd == 'dlsu.edu.ph') {
				const temp = await User.findOne({ email: profile.email }).lean().exec()
				return temp != null
			}
			return false
		}
	},
	pages: {
		error: '/'
	},
})
