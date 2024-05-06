import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Application from '@models/application'
import User from '@models/user'
import sendEmail from '@lib/sendEmail'
import { FormSchema } from '@components/application-form'
import Committee from '@models/committee'
import logger from '@lib/logger'
import ApplicationEmail from '@components/mail/application'

const applyHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await dbConnect()

		switch (req.method) {
			case 'GET': {
				// GET operation only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				const applicants = await Application.find().lean()
				res.json(applicants)
				break
			}

			case 'POST': {
				const body = req.body as FormSchema
				// check if duplicate entry
				const values = await Promise.all([
					Application.findOne({ $or: [{ email: body.email }, { idNumber: body.idNumber }] }, '_id').lean(),
					User.findOne({ $or: [{ email: body.email }, { idNumber: body.idNumber }] }, '_id').lean()
				])

				if (process.env.NODE_ENV !== 'development') {
					if (values[0]) {
						return res.status(406).send('You have already sent an application!')
					} else if (values[1]) {
						return res.status(406).send('You are already a tutor!')
					}
				}

				const [, emails, core] = await Promise.all([
					Application.create(req.body),
					Committee.getEmailAddresses('Activities'),
					Committee.getEmailAddresses('Core')
				])

				logger.info(`New application received from ${body.firstName} ${body.lastName}`)

				console.log(core)
				
				await Promise.all([
					sendEmail(body.email, '[PTS] Tutor Application', ApplicationEmail({ applicant: body, isApplicant: true })),
					sendEmail({ to: [emails.VP], cc: emails.AVP }, '[PTS] Tutor Application', ApplicationEmail({ applicant: body, isApplicant: false })),
				])
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500).send('A server-side error has occured. Please try again later.')
	} finally {
		res.end()
	}
}

export default applyHandler
