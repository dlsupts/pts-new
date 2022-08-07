import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request from '@models/request'
import Session from '@models/session'
import Tutee from '@models/tutee'
import User from '@models/user'
import { Types } from 'mongoose'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req
	const query = req.query as { reqId: string }

	// operations only for admin
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)
	await dbConnect()

	try {

		switch (method) {
			case 'PATCH': {
				if (body.tutor) { // assigning a tutor
					const wasMatched = await Session.exists({ request: query.reqId, tutor: body.tutor }) as boolean

					await Promise.all([
						Session.updateMany({ request: query.reqId, tutor: null }, body),
						(async () => {
							if (!wasMatched) {
								await User.updateOne({ _id: body.tutor }, { $inc: { 'tuteeCount': 1 } })
							}
						})()
					])
				} else { // unassigning all tutors from all sessions related to a request
					const tutors: Types.ObjectId[] = await Session.find({ request: query.reqId }).distinct('tutor')
					await Promise.all([
						Session.updateMany({ request: query.reqId }, { tutor: null }),
						User.updateMany({ _id: { $in: tutors } }, { $inc: { tuteeCount: -1 } })
					])
				}
				break
			}

			case 'DELETE': {
				await Promise.all([
					// update all tutee count of tutors related to the request and removes all the sessions
					(async () => {
						const tutors: Types.ObjectId[] = await Session.find({ request: query.reqId }).distinct('tutor')

						await Promise.all([
							Session.deleteMany({ request: query.reqId }),
							User.updateMany({ _id: { $in: tutors } }, { $inc: { tuteeCount: -1 } })
						])
					})(),

					// delete request and tutee
					(async () => {
						const request = await Request.findByIdAndDelete(query.reqId).lean()
						await Tutee.deleteOne({ _id: request?.tutee })
					})()
				])

				break
			}

			default:
				res.setHeader('Allow', ['DELETE', 'PATCH'])
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
