import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User from '@models/user'
import { getSession } from 'next-auth/react'
import JSZip from 'jszip'
import { parse } from 'json2csv'
import Dates from '@models/date'
import logger from '@lib/logger'
import Request from '@models/request'

const exportHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				const prefix = `[${(await Dates.getAYTerm(undefined, true))._id}]`
				const zip = new JSZip()
				const csv = zip.folder('csv')
				const json = zip.folder('json')

				if (csv == null || json == null) throw Error('Error exporting database!')

				const [tutors, tutees, sessions] = await Promise.all([
					User.find(
						{ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } },
						'-_id idNumber email course terms maxTuteeCount firstName lastName middleName lastActive'
					).lean(),

					Request.aggregate()
						// sets a new `serviced` field that is true when the number of sessions that have a tutor is non-zero
						.addFields({
							serviced: {
								$toBool: {
									$size: {
										$filter: {
											input: '$sessions',
											as: 'sessions',
											cond: '$$sessions.tutor'
										}
									}
								}
							}
						})
						.replaceRoot({ $mergeObjects: ['$tutee', { serviced: '$serviced' }] })
						.project({ campus: 1, firstName: 1, lastName: 1, email: 1, college: 1, course: 1, serviced: 1 }),

					Request.aggregate()
						.unwind('sessions')
						.replaceRoot('sessions')
						.project({ tutor: 0 })
				])

				try {
					csv.file(`${prefix} tutors.csv`, parse(tutors))
					json.file(`${prefix} tutors.json`, JSON.stringify(tutors))
				} catch (err) {
					console.error('Problem exporting tutor data: ' + err)
				}

				try {
					csv.file(`${prefix} tutees.csv`, parse(tutees))
					json.file(`${prefix} tutees.json`, JSON.stringify(tutees,))
				} catch (err) {
					console.error('Problem exporting tutee data: ' + err)
				}

				try {
					csv.file(`${prefix} sessions.csv`, parse(sessions))
					json.file(`${prefix} sessions.json`, JSON.stringify(sessions))
				} catch (err) {
					console.error('Problem exporting sessions: ' + err)
				}

				const blob = await zip.generateAsync({ type: 'base64' })
				logger.info(`ADMIN [${session.user._id}] EXPORTED the database`)

				res.send(blob)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default exportHandler