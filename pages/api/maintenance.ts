import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import User from '@models/user'
import { getSession } from 'next-auth/react'

const maintenanceHandler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
	const { body, method } = req

	try {
		const session = await getSession({ req })
		if (session?.user.type != 'ADMIN') return res.status(403)		
		
		await dbConnect()

		switch (method) {
			case 'GET': {
				const user = await User.findOne({ email: process.env.ADMIN_EMAIL }).lean()	
				res.send(user?.reset || false)
				break
			}

			case 'PUT': {			
				await User.updateOne({ email: process.env.ADMIN_EMAIL }, { reset: body.reset })
				res.send(body.reset)
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'PUT'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default maintenanceHandler
