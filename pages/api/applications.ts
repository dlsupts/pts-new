import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/db'
import Application from '../../models/application'

const applyHandler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
	try {
		await dbConnect()

		switch (req.method) {
			case "POST": {
				await Application.create(req.body)
				break
			}

			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default applyHandler