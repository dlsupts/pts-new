import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import Tutee from '@models/tutee'
import Request from '@models/request'
import Schedule from '@models/schedule'
import Dates from '@models/date'
import Session from '@models/session'
import { Types } from 'mongoose'
import { RequestStore } from '@stores/request-store'
import sendEmail from '@lib/sendEmail'
import Committee from '@models/committee'

export type TuteePostAPIBody = Pick<RequestStore, 'tutee' | 'request' | 'selectedSubjects'>

const tuteeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const body = req.body as TuteePostAPIBody

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				const tutees = await Tutee.find({}, '-__v').populate({
					path: 'schedule',
					select: '-_id -__v'
				}).lean()
				res.json(tutees)
				break
			}

			case "POST": {
				const [, email] = await Promise.all([
					(async () => {
						const timestamp = new Date()

						const [{ _id: ayterm }, { _id: tuteeId }] = await Promise.all([
							Dates.getAYTerm(),
							(async () => {
								const { _id: schedId } = await Schedule.create(body.tutee.schedule)
								return await Tutee.create({ ...body.tutee, schedule: schedId })
							})()
						])

						const { _id: reqId } = await Request.create({
							timestamp,
							ayterm,
							...body.request,
							preferred: Types.ObjectId.isValid(body.request.preferred) ? body.request.preferred : null,
							tutee: tuteeId,
						})
						await Session.insertMany(body.selectedSubjects.map(([subject, topics]: string[]) => ({
							request: reqId,
							subject,
							topics,
						})))
					})(),
					Committee.getVPEmail('Internal Affairs')
				])

				await Promise.all([
					sendEmail(body.tutee.email, '[PTS] New Tutor Request', 'request', { toTutee: true, ...body }),
					sendEmail(email, '[PTS] New Tutor Request', 'request', { toTutee: false, ...body })
				])
				break
			}

			default:
				res.setHeader('Allow', ['POST', 'GET'])
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
