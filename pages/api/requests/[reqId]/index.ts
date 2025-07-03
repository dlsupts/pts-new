import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request from '@models/request'
import User from '@models/user'
import sendEmail from '@lib/sendEmail'
import AssignmentEmail from '@components/mail/assignment'
import logger from '@lib/logger'
import { MongoID } from '@types'

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
				if (!body.tutor) { // unassigning all tutors from all sessions related to a request
					const tutors: MongoID[] = await Request.findById<MongoID[]>(query.reqId).distinct('sessions.tutor')

					await Promise.all([
						// clear tutors in sessions
						Request.updateOne({ _id: query.reqId }, { 'sessions.$[].tutor': null }),
						User.batchIncrementTuteeCount(tutors, -1)
					])

					return logger.info(`ADMIN [${session.user._id}] UNASSIGNED request ${query.reqId}`)
				}

				// assigning a tutor
				const isHandledByTutor = await Request.isHandledByTutor(query.reqId, body.tutor)

				const [tutor, request] = await Promise.all([
					User.incrementTuteeCount(!isHandledByTutor, body.tutor, 1, '-_id email'),
					Request.findOneAndUpdate({ _id: query.reqId }, //TODO: Update stastics.ts for matched attribute
						{ 'sessions.$[element].tutor': body.tutor, 'sessions.$[element].status': 'Matched' },
						{
							arrayFilters: [{ 'element.tutor': undefined }], // match sessions without assigned tutors
							projection: { _id: 0, tutee: 1, duration: 1, tutorialType: 1, 'sessions.tutor': 1, 'sessions.subject': 1, 'sessions.topics': 1, earliestDate: 1, latestDate: 1 },
						}
					).lean(),
				])

				if (!request) throw Error(`Request ${query.reqId} not found!`)
				logger.info(`ADMIN [${session.user._id}] ASSIGNED request ${query.reqId}`)

				request.sessions = request.sessions.filter(s => !s.tutor)

				if (tutor && request) {
					await sendEmail(tutor.email, '[PTS] New Tutee', AssignmentEmail({ request }))
				}
				break
			}

			case 'DELETE': {
				const request = await Request.findByIdAndDelete(query.reqId, {
					projection: '-_id tutee.firstName tutee.lastName sessions.tutor'
				}).lean()

				if (!request) {
					throw Error(`Request ${query.reqId} does not exist!`)
				}

				// create a set of tutor ids that were assigned to the tutee
				const tutors = request.sessions.reduce((set, s) => {
					if (s.tutor) set.add(s.tutor.toString())
					return set
				}, new Set() as Set<string>)

				await User.batchIncrementTuteeCount(Array.from(tutors), -1)

				logger.info(`ADMIN [${session.user._id}] DELETED request ${query.reqId} by ${request?.tutee.firstName} ${request?.tutee.lastName}`)
				break
			}

			default:
				res.setHeader('Allow', ['DELETE', 'PATCH'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default handler
