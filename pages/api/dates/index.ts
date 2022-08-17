import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Dates from '@models/date'
import { MongoError } from 'mongodb'
import logger from '@lib/logger'

const dateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await dbConnect()

		switch (req.method) {
			case 'GET': {
				const dates = await Dates.find().lean()
				res.json(dates)
				break
			}

			case 'POST': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				const date = await Dates.create({
					_id: req.body._id,
					start: new Date(req.body.start),
					end: new Date(req.body.end)
				})
				logger.info(`ADMIN [${session.user._id}] CREATED ${req.query.id} dates`)
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
		logger.error(err)
		res.status(500).send('A server-side error has occured. Please try again later.')
	} finally {
		res.end()
	}
}

export default dateHandler
