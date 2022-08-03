import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import Request from '@models/request'
import Session from '@models/session'
import Tutee from '@models/tutee'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	// operations only for admin
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)
	await dbConnect()

	try {

		switch (method) {
			case 'DELETE': {
				await Promise.all([
					Session.deleteMany({ request: req.query.id }),
					(async () => {
						const request = await Request.findByIdAndDelete(req.query.id).lean()
						await Tutee.deleteOne({ _id: request?.tutee })
					})()
				])

				break
			}

			default:
				res.setHeader('Allow', ['DELETE'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default handler
