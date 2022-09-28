import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import User, { IUser } from '@models/user'
import Dates from '@models/date'
import logger from '@lib/logger'
import Session from '@models/session'

const meHandler = async (req: NextApiRequest, res: NextApiResponse<IUser>) => {
	const session = await getSession({ req })

	// no session found
	if (session?.user?.email == null) {
		res.status(401)
		return res.end()
	}

	const { _id } = session.user

	try {
		await dbConnect()

		switch (req.method) {
			case "GET": {
				const user = await User.findById(_id).lean().exec()
				if (user == null) throw new Error('User not found in registry!')
				res.send(user)
				break
			}

			case "PATCH": {
				// if max tutee is set to non-zero or has tutees, set last active to current term
				if (req.body.maxTuteeCount > 0 || (await Session.find({ tutor: session.user._id }).countDocuments() > 0)) {
					req.body.lastActive = (await Dates.getAYTerm())._id
				} else {
					req.body.lastActive = null
				}

				const user = await User.findByIdAndUpdate(_id, req.body, { new: true }).lean().exec()
				if (user == null) throw new Error('User not found in registry!')
				res.send(user)
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'PATCH'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default meHandler
