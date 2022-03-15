import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/db'
import Tutee from '../../models/tutee'
import Request from '../../models/request'
import Schedule from '../../models/schedule'
import Dates from '../../models/date'
import Session from '../../models/session'
import { Types } from 'mongoose'

const tuteeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req

	try {
		await dbConnect()

		switch (method) {
			case "POST": {
				const timestamp = new Date()
				const term = await Dates.findOne({
					_id: { $regex: '^(AY).*' },
					start: { $lt: timestamp },
					end: { $gt: timestamp }
				})
				if (!term) throw Error('Missing term definition')

				const { _id: ayterm } = term
				const { _id: schedId } = await Schedule.create(body.tutee.schedule)
				const { _id: tuteeId } = await Tutee.create({ ...body.tutee, schedule: schedId })
				const { _id: reqId } = await Request.create({
					timestamp,
					ayterm,
					...body.request,
					preferred: Types.ObjectId.isValid(body.request.preferred) ? body.request.preferred : null,
					tutee: tuteeId,
				})
				await Session.insertMany(body.subjects.map(([subject, topics]: string[]) => ({
					request: reqId,
					subject,
					topics,
				})))
				break
			}

			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default tuteeHandler
