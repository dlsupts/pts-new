import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { MongoError } from 'mongodb'
import dbConnect from '@lib/db'
import Library from '@models/library'
import logger from '@lib/logger'

const libraryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const session = await getSession({ req })
		if (session?.user.type != 'ADMIN') return res.status(403)

		await dbConnect()

		switch (req.method) {
			case 'GET': {
				const libraries = await Library.find({ _id: { $ne: 'Committees' } }).lean()
				res.json(libraries)
				break
			}

			case 'POST': {
				const library = await Library.create(req.body)
				logger.info(`ADMIN [${session.user._id}] DELETED ${library?._id} library`)
				res.send(library)
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

export default libraryHandler
