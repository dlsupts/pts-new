import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request, { IRequest } from '@models/request'
import { Types } from 'mongoose'
import logger from '@lib/logger'
import { RequestStore } from '@stores/request-store'
import Dates from '@models/date'
import sendEmail from '@lib/sendEmail'
import Committee from '@models/committee'
import RequestEmail from '@components/mail/request'
import { tuteeInfoSchema } from '@models/tutee'
import { isWholeTermStillAvailable } from '@lib/utils'

export type TuteePostAPIBody = Pick<RequestStore, 'tutee' | 'request' | 'selectedSubjects'>

export type RequestAPI = Omit<IRequest, 'timestamp' | 'ayterm'>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	try {
		await dbConnect()
		switch (method) {
			case 'GET': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				try {
					const requests = await Request.find({}, '-timestamp -ayterm').sort({ _id: -1 })
					res.send(requests as RequestAPI[])
				} catch (err) {
					res.send(err)
				}

				break
			}

			case 'POST': {
				const body = req.body as TuteePostAPIBody

				const [email] = await Promise.all([
					Committee.getVPEmail('Internal Affairs'),
					createRequest(body),
				])

				logger.info(`Tutor request submitted by ${body.tutee.firstName} ${body.tutee.lastName}`)

				await Promise.all([
					sendEmail(body.tutee.email, '[PTS] New Tutor Request', RequestEmail({ toTutee: true, ...body })),
					sendEmail(email, '[PTS] New Tutor Request', RequestEmail({ toTutee: false, ...body }))
				])
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
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

async function createRequest(body: TuteePostAPIBody) {
	try {

		const timestamp = new Date()

		const [{ _id: ayterm }, tutee, date] = await Promise.all([
			Dates.getAYTerm(),
			tuteeInfoSchema.validate(body.tutee),
			Dates.findById('Tutor Request', '-_id end').lean()
		])

		if (body.request.duration == 'Whole Term' && !isWholeTermStillAvailable(date?.end)) {
			throw Error('Whole-term sessions are no longer available! Please resubmit your request.')
		}

		await Request.create({
			timestamp,
			ayterm,
			...body.request,
			preferred: Types.ObjectId.isValid(body.request.preferred) ? body.request.preferred : null,
			tutee,
			sessions: body.selectedSubjects.map(([subject, topics]) => ({ subject, topics }))
		})
	} catch (error) {
		console.log(error)
	}
}