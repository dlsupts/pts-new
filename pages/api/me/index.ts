import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import User, { IUser } from '@models/user'
import Dates from '@models/date'

const meHandler = async (req: NextApiRequest, res: NextApiResponse<IUser>) => {
	const session = await getSession({ req })

	// no session found
	if (session?.user?.email == null) {
		res.status(401)
		return res.end()
	}

	const email = session.user.email

	try {
		await dbConnect()

		switch (req.method) {
			case "GET": {
				const user = await User.findOne({ email }).lean().exec()
				if (user == null) throw new Error('User not found in registry!')
				res.send(user)
				break
			}

			case "PATCH": {
				if (req.body.membership) {
					req.body.lastActive = (await Dates.getAYTerm())._id
				}

				const user = await User.findOneAndUpdate({ email }, req.body, { new: true }).lean().exec()
				if (user == null) throw new Error('User not found in registry!')
				res.send(user)
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'PATCH'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default meHandler