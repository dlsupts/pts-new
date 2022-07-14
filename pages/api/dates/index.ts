import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Dates from '@models/date'
import { MongoError } from 'mongodb'

const dateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const session = await getSession({ req })
		if (session?.user.type != 'ADMIN') return res.status(403)

		await dbConnect()

		switch (req.method) {
			case 'GET': {
				const dates = await Dates.find().lean()
				res.json(dates)
				break
			}

			case 'POST': {
				const date = await Dates.create({
					_id: req.body._id,
					start: new Date(req.body.start),
					end: new Date(req.body.end)
				})
				res.send(date)
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		if ((err as MongoError).code == 11000) {
			res.status(403).send('You have entered a duplicate key!')
		}
		console.log(err)
		res.status(500).send('A server-side error has occured. Please try again later.')
	} finally {
		res.end()
	}
}

export default dateHandler
