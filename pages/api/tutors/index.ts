import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import User from '../../../models/user'
import { getSession } from 'next-auth/react'

const userHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		method,
		query
	} = req

	try {
		await dbConnect()

		switch (method) {
			case "GET": {
				// called to fill out the select options in preferred tutor
				if (query.filter == 'preference') {
					const tutors = await User
						.find({
							membership: true,
							userType: 'TUTOR',
							tutoringService: { $ne: ['None'] },
							$expr: { $lt: [ '$tuteeCount', '$maxTuteeCount' ] }
						}, 'firstName lastName topics')
						.sort('firstName').lean().exec()
					return res.json(tutors)
				}

				// all tutors only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				const tutors = await User.find({ userType: 'TUTOR' }).sort('lastName').lean().exec()
				res.json(tutors)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
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