import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request from '@models/request'
import Session from '@models/session'
import Tutee from '@models/tutee'
import User from '@models/user'
import sendEmail from '@lib/mail/sendEmail'
import tutorialTypes from '@lib/tutorial-types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req
	const query = req.query as { reqId: string, sessId: string }

	// operations only for admin
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)
	await dbConnect()

	try {

		switch (method) {
			case 'PATCH': {
				if (body.tutor) { // assigning a tutor
					const wasMatched = await Session.exists({ request: query.reqId, tutor: body.tutor }) as boolean

					const [tutor, request, session] = await Promise.all([
						User.findById(body.tutor, '-_id email').lean(),
						Request.findById(query.reqId, '-_id tutee duration tutorialType').lean(),
						Session.findByIdAndUpdate(query.sessId, { tutor: body.tutor, status: 'matched' }, {
							projection: '-_id subject topics'
						}).lean(),
						(async () => {
							if (!wasMatched) { // only increment if was not matched before
								await User.updateOne({ _id: body.tutor }, { $inc: { 'tuteeCount': 1 } })
							}
						})()
					])
					
					const tutee = await Tutee.findById(request?.tutee, '-_id -schedule -__v').lean()

					if (tutor?.email) {
						await sendEmail(tutor.email, '[PTS] New Tutee', 'assignment', {
							request: {
								...request,
								tutorialType: request?.duration == 'One Session' ?
									tutorialTypes['One Session'].find(({ value }) => value == request.tutorialType)?.text
									:
									request?.tutorialType
							},
							subjects: [{ ...session }],
							tutee,
						})
					}
				} else { // unassigning a tutor
					const sess = await Session.findByIdAndUpdate(query.sessId, { tutor: null }).lean()
					const hasSessions = await Session.exists({ request: query.reqId, tutor: sess?.tutor })

					if (!hasSessions && sess?.tutor) { // no longer handles any session of the tutee
						await User.updateOne({ _id: sess.tutor }, { $inc: { 'tuteeCount': -1 } })
					}
				}
				break
			}

			case 'DELETE': {
				const sess = await Session.findByIdAndDelete(query.sessId).lean()

				await Promise.all([
					// if no more subjects linked to the request are handled by the tutor, decrement by 1
					(async () => {
						const count = await Session.find({ request: sess?.request, tutor: sess?.tutor }).countDocuments()

						if (count == 0 && sess?.tutor) {
							await User.updateOne({ _id: sess.tutor }, { $inc: { tuteeCount: -1 } })
						}
					})(),

					// if no more sessions for a particular request, delete the request and tutee
					(async () => {
						const count = await Session.find({ request: sess?.request }).countDocuments()

						if (count == 0) {
							const request = await Request.findByIdAndDelete(sess?.request).lean()
							await Tutee.deleteOne({ _id: request?.tutee })
						}
					})(),
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
