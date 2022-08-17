import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Committee from '@models/committee'
import logger from '@lib/logger'

const officerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)

	try {
		await dbConnect()

		switch (req.method) {
			case 'POST': {
				await Committee.updateOne(
					{ _id: req.query.committeeId },
					{ $push: { officers: req.body } },
				)
				await res.revalidate('/about')
				break
			}

			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default officerHandler