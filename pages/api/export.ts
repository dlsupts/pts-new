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
					User.aggregate()
						.match({ email: { $ne: process.env.NEXT_PUBLIC_ADMIN_EMAIL } })
						.project({
							idNumber: 1,
							email: 1,
							course: 1,
							terms: 1,
							maxTuteeCount: 1,
							firstName: 1,
							lastName: 1,
							middleName: 1,
							lastActive: 1,
							topics: {
								$substr: [ // removes extra comma in front
									{
										$reduce: { // comma-separated subject titles with extra comma in front
											input: '$topics',
											initialValue: '',
											in: {
												$concat: ['$$value', ', ', { $arrayElemAt: ['$$this', 0] }]
											}
										}
									}, 2, -1]
							}
						})
						.lookup({
							from: 'requests',
							localField: '_id',
							foreignField: 'sessions.tutor',
							as: 'tutee_count',
						})
						.addFields({
							tutee_count: { $size: '$tutee_count' }
						})
						.project({ _id: 0 })
					,

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
						.replaceRoot({ $mergeObjects: ['$$ROOT', '$sessions', '$tutee'] })
						.lookup({ // get tutor
							from: 'users',
							localField: 'tutor',
							foreignField: '_id',
							as: 'tutor',
						})
						.project({	// get tutor first name and last name
							tutor: {
								$concat: [
									{ $arrayElemAt: ['$tutor.firstName', 0] },
									' ',
									{ $arrayElemAt: ['$tutor.lastName', 0] }
								]
							},
							tutee_name: { $concat: ['$tutee.firstName', ' ', '$tutee.lastName'] },
							tutee_id: '$tutee.idNumber',
							tutee_college: '$tutee.college',
							tutee_course: '$tutee.course',
							tutee_email: '$tutee.email',
							tutee_contact: '$tutee.contact',
							tutee_fb: '$tutee.url',
							tutee_campus: '$tutee.campus',
							duration: 1,
							tutorialType: 1,
							subject: 1,
							topics: 1,
							status: 1,
							earliestDate: 1,
							latestDate: 1,
						})
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