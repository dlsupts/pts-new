import logger from '@lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../lib/db'
import Application from '../../../models/application'

const applyHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await dbConnect()

		switch (req.method) {
			case 'DELETE': {
				// DELETE operation only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)
				await Application.deleteOne({ _id: req.query.id })
				break
			}

			default:
				res.setHeader('Allow', ['DELETE'])
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
