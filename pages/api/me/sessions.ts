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
		return res.status(401).end()
	}

	const { _id } = session.user

	try {
		await dbConnect()

		switch (req.method) {
			case "GET": {
				const requests = await Request.aggregate([
					{
						$match: { sessions: { $elemMatch: { tutor: new Types.ObjectId(_id) } } }
					},
					{
						$addFields: {
							sessions: {
								$filter: {
									input: '$sessions',
									as: 'session',
									cond: { $eq: ['$session.tutor', new Types.ObjectId(_id)] }
								}
							}
						}
					},
					{
						$project: {
							sessions: 1,
							tutee: 1,
							duration: 1,
							tutorialType: 1
						}
					},
					{
						$sort: { _id: 1 }
					}
				]).exec()

				return res.status(200).json(requests)
			}
			default:
				res.setHeader('Allow', ['GET'])
				return res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		return res.status(500).end()
	}
}

export default mySessionsHandler