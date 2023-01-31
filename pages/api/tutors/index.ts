import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User from '@models/user'
import { getSession } from 'next-auth/react'
import Application from '@models/application'
import sendEmail from '@lib/sendEmail'
import AcceptanceEmail from '@components/mail/acceptance'
import logger from '@lib/logger'

const userHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		method,
		query,
		body,
	} = req

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				// called to fill out the select options in preferred tutor
				if (query.filter == 'preference') {
					const tutors = await User
						.find({
							email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL },
							membership: true,
						}, 'firstName lastName topics')
						.sort('firstName').lean().exec()
					return res.json(tutors)
				}

				// all tutors only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				switch (query.filter) {
					case 'simple': {
						const tutors = await User.find({ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } }, 'firstName lastName')
							.sort('firstName').lean().exec()
						res.json(tutors)
						break
					}

					case 'request': {
						const tutors = await User.find(
							{ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL }, membership: true },
							'firstName lastName schedule tutoringService tutorialType tuteeCount maxTuteeCount topics'
						)
							.populate({ path: 'schedule', select: '-_id' })
							.sort('firstName')
							.lean()
						res.json(tutors)
						break
					}

					default: {
						const tutors = await User.aggregate()
							.match({ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } })
							.lookup({
								from: 'requests',
								as: 'requests',
								localField: '_id',
								foreignField: 'sessions.tutor',
								pipeline: [{
									$project: { 'tutee.firstName': 1, 'tutee.lastName': 1, 'sessions.subject': 1, 'sessions.tutor': 1 }
								}]
							})
							// parse requests to be of this shape: { _id, tutee, subjects: string[]}[]
							.addFields({
								requests: { 
									$map: { // for each request
										input: '$requests',
										as: 'request',
										in: {
											_id: '$$request._id',
											tutee: '$$request.tutee',
											subjects: {
												$reduce: { // reduce sessions to become an array of subject strings
													input: {
														$filter: { // filter subset of the sessions that matched the tutor id
															input: '$$request.sessions',
															as: 'session',
															cond: { $eq: ['$$session.tutor', '$_id'] }
														}
													},
													initialValue: [],
													in: { $concatArrays: ['$$value', ['$$this.subject']] }
												}
											}
										}
									}
								}
							})
							.sort('lastName')

						res.json(tutors)
					}
				}
				break
			}

			case 'POST': {
				// tutor creation only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				// requires applicant record
				const applicant = await Application.findOneAndDelete({ _id: body._id }, { projection: '-_id' }).lean()
				if (!applicant) return res.status(406).send('Applicant not found!')
				logger.info(`ADMIN [${session.user._id}] DELETED ${applicant.firstName} ${applicant.lastName}'s application for promotion`)

				await User.create(applicant)
				logger.info(`ADMIN [${session.user._id}] PROMOTED applicant ${applicant.firstName} ${applicant.lastName} to TUTOR`)

				await sendEmail(applicant.email, '[PTS] Welcome to PTS!', AcceptanceEmail())
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default userHandler