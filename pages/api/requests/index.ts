import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request, { IRequest } from '@models/request'
import { ISession } from '@models/session'
import { Types } from 'mongoose'

export interface IReqSession extends Omit<IRequest, 'ayterm' | 'timestamp' | 'tutee'> {
	_id: Types.ObjectId
	tutee: string
	session: Omit<ISession, 'request'>
}

const handler = async (req: NextApiRequest, res: NextApiResponse<IReqSession[]>) => {
	const { method } = req

	// operations only for admin
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)
	await dbConnect()

	try {

		switch (method) {
			case 'GET': {
				const requests = await Request.aggregate()
					.lookup({
						from: 'sessions',
						localField: '_id',
						foreignField: 'request',
						as: 'session'
					})
					.unwind({ path: '$session' })
					.project({ duration: 1, tutorialType: 1, preferred: 1, tutee: 1, session: 1 })
					.project({ 'session.request': 0, __v: 0, 'session.__v': 0 })

				res.send(requests as IReqSession[])
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

export default handler