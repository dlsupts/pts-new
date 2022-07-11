import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User from '@models/user'
import { getSession } from 'next-auth/react'
import Application from '@models/application'
import '@models/schedule'
import Schedule from '@models/schedule'

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
							email: { $ne: process.env.ADMIN_EMAIL },
							membership: true,
							tutoringService: { $ne: ['None'] },
							$expr: { $lt: ['$tuteeCount', '$maxTuteeCount'] }
						}, 'firstName lastName topics')
						.sort('firstName').lean().exec()
					return res.json(tutors)
				}

				// all tutors only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				if (query.filter == 'simple') {					
					const tutors = await User.find({ email: { $ne: process.env.ADMIN_EMAIL } }, 'firstName lastName')
						.sort('firstName').lean().exec()
					return res.json(tutors)
				}

				const tutors = await User.find({ email: { $ne: process.env.ADMIN_EMAIL }, })
					.sort('lastName').populate('schedule').lean().exec()
				res.json(tutors)
				break
			}

			case 'POST': {
				// tutor creation only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				// requires applicant record
				const applicant = await Application.findOneAndDelete({ _id: body._id }).lean()
				if (!applicant) return res.status(406).send('Applicant not found!')

				const schedule = await Schedule.create({})

				delete applicant._id
				delete applicant.__v

				await User.create({
					...applicant,
					schedule: schedule._id
				})

				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default userHandler