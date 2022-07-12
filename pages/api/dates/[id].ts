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
				const date = await Dates.findById(req.query.id)
				res.send(date)
				break
			}

			case 'PATCH': {
				await Dates.updateOne({ _id: req.query.id }, {
					start: new Date(req.body.start),
					end: new Date(req.body.end)
				})
				break
			}

			case 'DELETE': {
				await Dates.deleteOne({ _id: req.query.id })
				break
			}

			default:
				res.setHeader('Allow', ['PATCH', 'DELETE', 'GET'])
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
