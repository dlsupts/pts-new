import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { Types } from 'mongoose'
import dbConnect from '@lib/db'
import { IRequest } from '@models/request'
import logger from '@lib/logger'
import Request from '@models/request'

export type SessionAPI = Pick<IRequest, 'duration' | 'tutorialType' | 'tutee' | 'sessions'>

const mySessionsHandler = async (req: NextApiRequest, res: NextApiResponse<SessionAPI[]>) => {
	const session = await getSession({ req })

	// no session found
	if (session?.user?._id == null) {
		res.status(401)
		return res.end()
	}

	const { _id } = session.user

	try {
		await dbConnect()

		switch (req.method) {
			case "GET": {
				const requests = await Request.find(
					{ sessions: { $elemMatch: { tutor: _id } } },
					{
						sessions: {
							$filter: {
								input: '$sessions',
								as: 'session',
								cond: { $eq: ['$$session.tutor', new Types.ObjectId(_id)] }
							}
						},
						tutee: 1,
						duration: 1,
						tutorialType: 1,
					}
				).sort({ _id: 1 })

				res.send(requests)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default mySessionsHandler