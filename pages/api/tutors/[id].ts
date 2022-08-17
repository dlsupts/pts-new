import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User from '@models/user'
import { getSession } from 'next-auth/react'
import '@models/schedule'
import logger from '@lib/logger'

const tutorHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query } = req

	try {
		await dbConnect()

		switch (method) {
			case 'DELETE': {
				// delete operation only for ADMIN
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				const user = await User.findOneAndDelete({ _id: query.id }, {
					projection: '-_id firstName lastName'
				}).lean().exec()

				if (user) {
					logger.info(`ADMIN [${session.user._id}] DELETED tutor ${user.firstName} ${user.lastName}`)
				}
				break
			}

			default:
				res.setHeader('Allow', ['DELETE'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default tutorHandler