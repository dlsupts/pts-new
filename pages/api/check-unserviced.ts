import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import logger from '@lib/logger'
import Request from '@models/request'
import sendEmail from '@lib/sendEmail'
import { UnservicedEmail } from '@components/mail/unserviced'

const handler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
	const { method, headers } = req

	try {
		if (headers.authorization !== `Bearer ${process.env.NEXTAUTH_SECRET}`) {
			return res.status(401)
		}

		switch (method) {
			case 'POST': {
				await dbConnect()

				const requests = await Request.aggregate()
					.match({
						emailSent: false,
						sessions: { $elemMatch: { tutor: null } },
						$or: [
							{ duration: 'One Session', latestDate: { $lte: new Date() } }, // one sessions who have exceeded latest dates
							{ duration: 'Whole Term', timestamp: { $lte: new Date(Date.now() - 604_800_000) } } // whole terms requests that are pending for 1 week
						]
					})
					.addFields({
						// remove sessions that already have tutors
						sessions: {
							$filter: {
								input: '$sessions',
								as: 'sessions',
								cond: { $not: '$$sessions.tutor' }
							}
						}
					})
					.replaceRoot({ $mergeObjects: ['$$ROOT', '$tutee', { sessions: '$sessions' }] })
					.project({ _id: 1, email: 1, 'sessions.subject': 1, duration: 1 })

				await Promise.all(requests.map((request) =>
					sendEmail(request.email, 'Unserviced Tutor Request', UnservicedEmail(request))
				))
				
				logger.info('Sent emails to unserviced requests')
				await Request.updateMany({ _id: { $in: requests.map(r => r._id) } }, { emailSent: true })
				break
			}

			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default handler
