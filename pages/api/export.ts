import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User from '@models/user'
import { getSession } from 'next-auth/react'
import JSZip from 'jszip'
import { parse } from 'json2csv'
import Tutee from '@models/tutee'
import Dates from '@models/date'
import Session from '@models/session'
import logger from '@lib/logger'

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

				const tutors = await User.find(
					{ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } },
					'-_id -contact -url -membership -tutoringService -tutorialType -tuteeCount -topics -schedule -userType -reset -__v'
				).lean()
				const tutees = await Tutee.aggregate()
					.lookup({ from: 'requests', localField: '_id', foreignField: 'tutee', as: 'request' })
					.unwind('request')
					.lookup({ from: 'sessions', localField: 'request._id', foreignField: 'request', as: 'sessions' })
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
					.project({ _id: 0, idNumber: 0, url: 0, friends: 0, schedule: 0, contact: 0, __v: 0, sessions: 0, request: 0 })
				const sessions = await Session.find({}, '-_id -request -tutor -__v').lean()

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