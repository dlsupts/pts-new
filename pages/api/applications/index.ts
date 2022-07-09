import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../lib/db'
import Application from '../../../models/application'
import User from '../../../models/user'

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
				// check if duplicate entry
				const values = await Promise.all([
					Application.findOne({ $or: [{ email: req.body.email }, { idNumber: req.body.idNumber }] }, '_id').lean(),
					User.findOne({ $or: [{ email: req.body.email }, { idNumber: req.body.idNumber }] }, '_id').lean()
				])
				
				if (values[0]) {
					return res.status(406).send('You have already sent an application!')
				} else if (values[1]) {
					return res.status(406).send('You are already a tutor!')
				}
				await Application.create(req.body)
				
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500).send('A server-side error has occured. Please try again later.')
	} finally {
		res.end()
	}
}

export default applyHandler
