import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Session, { ISession } from '@models/session'
import { Types } from 'mongoose'
import dbConnect from '@lib/db'
import { ITutee } from '@models/tutee'
import { IRequest } from '@models/request'

export interface IReqSesssion extends Pick<IRequest, 'duration' | 'tutorialType'> {
	_id: Types.ObjectId
	sessions: Pick<ISession, 'subject' | 'topics'>[]
	tutee: ITutee
}

const mySessionsHandler = async (req: NextApiRequest, res: NextApiResponse<IReqSesssion[]>) => {
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
				const requests = await Session.aggregate()
					.match({ tutor: new Types.ObjectId(_id.toString()) })
					.group({
						_id: '$request',
						sessions: {
							$push: { topics: '$topics', subject: '$subject' }
						}
					})
					.lookup({
						from: 'requests',
						localField: '_id',
						foreignField: '_id',
						as: 'request'
					})
					.lookup({
						from: 'tutees',
						localField: 'request.tutee',
						foreignField: '_id',
						as: 'tutee',
						pipeline: [
							{
								$lookup: {
									from: 'schedules',
									localField: 'schedule',
									foreignField: '_id',
									as: 'schedule'
								},
							},
							{ $set: { schedule: { $first: '$schedule' } } },
							{ $project: { 'schedule.__v': 0, 'schedule._id': 0, __v: 0 } }
						]
					})
					.replaceRoot({
						$mergeObjects: [
							{ $first: '$request' },
							'$$ROOT'
						]
					})
					.unwind({ path: '$tutee' })
					.project({ duration: 1, tutorialType: 1, tutee: 1, sessions: 1 })

				res.send(requests)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default mySessionsHandler