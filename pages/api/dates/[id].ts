import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Dates from '@models/date'
import logger from '@lib/logger'

const dateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await dbConnect()

		switch (req.method) {
			case 'GET': {
				if (req.query.id == 'ayterm') {
					try {
						const date = await Dates.getAYTerm(new Date())
						return res.send(date)
					} catch(err) {
						if (err instanceof Error && err.message == 'No term definition found!') return
						throw err
					}
				}

				const date = await Dates.findById(req.query.id)
				res.send(date)
				break
			}

			case 'PATCH': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				await Dates.updateOne({ _id: req.query.id }, {
					start: new Date(req.body.start),
					end: new Date(req.body.end)
				})
				logger.info(`ADMIN [${session.user._id}] UPDATED ${req.query.id} dates`)
				break
			}

			case 'DELETE': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				await Dates.deleteOne({ _id: req.query.id })
				logger.info(`ADMIN [${session.user._id}] DELETED ${req.query.id} dates`)
				break
			}

			default:
				res.setHeader('Allow', ['PATCH', 'DELETE', 'GET'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500).send('A server-side error has occured. Please try again later.')
	} finally {
		res.end()
	}
}

export default dateHandler
