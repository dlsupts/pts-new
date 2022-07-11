import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Dates from '@models/date'

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
				await Dates.create(req.body)
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

export default dateHandler
