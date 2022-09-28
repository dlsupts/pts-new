import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User, { IUser } from '@models/user'
import { getSession } from 'next-auth/react'
import Session from '@models/session'
import Tutee from '@models/tutee'
import Schedule, { ISchedule } from '@models/schedule'
import logger from '@lib/logger'

const maintenanceHandler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
	const { body, method } = req

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				const user = await User.findOne({ email: process.env.NEXT_PUBLIC_ADMIN_EMAIL }).lean()
				res.send(user?.reset ?? false)
				break
			}

			case 'PUT': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				await User.updateOne({ email: process.env.NEXT_PUBLIC_ADMIN_EMAIL }, { reset: body.reset })
				logger.info(`ADMIN [${session.user._id}] UPDATED maintenance status to ${body.reset}`)

				res.send(body.reset)
				break
			}

			// reset data for next term
			case 'DELETE': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				await Promise.all([
					Session.deleteMany(),
					Tutee.deleteMany(),	// also deletes their respective schedules
					User.updateMany({ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } }, {
						tutorialType: [],
						tutoringService: [],
						tuteeCount: 0,
						maxTuteeCount: 0,
						reset: true,
						storedLastActive: '$lastActive'
					} as Partial<IUser>),
					Schedule.updateMany({ M: [], T: [], W: [], H: [], F: [], S: [] } as ISchedule)
				])
				logger.info(`ADMIN [${session.user._id}] RESET the database`)

				break
			}

			default:
				res.setHeader('Allow', ['GET', 'PUT'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default maintenanceHandler
