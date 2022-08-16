import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request from '@models/request'
import Session from '@models/session'
import Tutee from '@models/tutee'
import User from '@models/user'
import { Types } from 'mongoose'
import sendEmail from '@lib/sendEmail'
import tutorialTypes from '@lib/tutorial-types'
import AssignmentEmail from '@components/mail/assignment'

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
					const [wasMatched, subjects] = await Promise.all([
						Session.exists({ request: query.reqId, tutor: body.tutor }),
						Session.find({ request: query.reqId, tutor: null }, '-_id subject topics').lean()
					])

					const [tutor, request] = await Promise.all([
						User.findById(body.tutor, '-_id email').lean(),
						Request.findById(query.reqId, '-_id tutee duration tutorialType').lean(),
						Session.updateMany({ request: query.reqId, tutor: null }, body), //TODO: Update "matched" attribute but also update stastics.ts
						(async () => {
							if (!wasMatched) {
								await User.updateOne({ _id: body.tutor }, { $inc: { 'tuteeCount': 1 } })
							}
						})()
					])

					const tutee = await Tutee.findById(request?.tutee, '-_id -schedule -__v').lean()

					if (tutor?.email && request && tutee) {
						await sendEmail(tutor.email, '[PTS] New Tutee', AssignmentEmail({
							request: {
								...request,
								tutorialType: request.duration == 'One Session' ?
									tutorialTypes['One Session'].find(({ value }) => value == request.tutorialType)?.text || ''
									:
									request.tutorialType
							},
							subjects,
							tutee,
						}))
					}
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
