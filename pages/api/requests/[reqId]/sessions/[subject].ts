import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request, { IRequest } from '@models/request'
import User from '@models/user'
import sendEmail from '@lib/sendEmail'
import AssignmentEmail from '@components/mail/assignment'
import logger from '@lib/logger'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req
	const query = req.query as { reqId: string, subject: string }

	// operations only for admin
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)
	await dbConnect()

	try {
		switch (method) {
			case 'PATCH': {
				if (!body.tutor) { // unassigning a tutor from a session
					const request = await Request.findByIdAndUpdate(query.reqId,
						{ 'sessions.$[element].tutor': null, 'sessions.$[element].status': 'Pending' },
						{
							arrayFilters: [{ 'element.subject': query.subject }],
							projection: '-_id sessions.subject sessions.tutor',
						}
					).lean()

					if (!request) throw Error(`Request ${query.reqId} not found!`)
					logger.info(`ADMIN [${session.user._id}] UNASSIGNED session ${query.subject}`)
					await checkAndDecrementTutorCount(request, query.subject)
					break
				}

				// assigning a tutor
				const isHandledByTutor = await Request.isHandledByTutor(query.reqId, body.tutor)

				const [tutor, request] = await Promise.all([
					User.incrementTuteeCount(!isHandledByTutor, body.tutor, 1, '-_id email'),
					Request.findOneAndUpdate({ _id: query.reqId },
						{ 'sessions.$[element].tutor': body.tutor, 'sessions.$[element].status': 'Matched' },
						{
							// update session tutor that has matching subject
							arrayFilters: [{ 'element.tutor': undefined, 'element.subject': query.subject }],
							// get first session that matches the query subject
							projection: { _id: 0, tutee: 1, duration: 1, tutorialType: 1, 'sessions': { $elemMatch: { subject: query.subject } }, earliestDate: 1, latestDate: 1 },
						}
					).lean(),
				])
				logger.info(`ADMIN [${session.user._id}] ASSIGNED session ${query.subject} to tutor ${tutor?._id}`)

				if (tutor && request) {
					await sendEmail(tutor.email, '[PTS] New Tutee', AssignmentEmail({ request }))
				}
				break
			}

			case 'DELETE': {
				// remove session element from array of sessions based on matching subject attribute
				const request = await Request.findByIdAndUpdate(
					query.reqId,
					{ $pull: { sessions: { subject: query.subject } } },
					{ projection: '-_id sessions' }
				).lean()

				if (!request) throw Error(`Request ${query.reqId} not found!`)
				logger.info(`ADMIN [${session.user._id}] DELETED session ${query.subject} of request ${query.reqId}`)

				await Promise.all([
					checkAndDecrementTutorCount(request, query.subject),
					checkAndDeleteEmptyRequest(request),
				])
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

/**
 * Checks the list of sessions before removing a subject, and decrements the tutee count of a tutor 
 * if the only subject that the tutor handles within the request was removed
 * @param request request object
 * @param subject string signifying the subject name
 */
async function checkAndDecrementTutorCount({ sessions }: IRequest, subject: string) {
	const counts = new Map<string, number>()
	let tutorId: string | undefined

	// get number of sessions taught by each tutor
	for (let i = 0; i < sessions.length; i++) {
		const tutor = sessions[i].tutor?.toString()

		if (!tutor) continue
		if (sessions[i].subject == subject) tutorId = tutor
		counts.set(tutor, (counts.get(tutor) ?? 0) + 1)
	}

	// tutor handles only one session (the one just removed)
	if (tutorId && counts.get(tutorId) == 1) {
		await User.incrementTuteeCount(true, tutorId, -1)
	}
}

/**
 * Checks the list of sessions before removing a subject and deletes the request object
 * if the list of sessions is empty
 * @param request request object
 */
async function checkAndDeleteEmptyRequest({ _id, sessions }: IRequest) {
	if (sessions.length == 1) {
		await Request.deleteOne({ _id })
	}
}
