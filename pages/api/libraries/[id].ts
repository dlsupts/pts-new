import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Library from '@models/library'

const libraryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await dbConnect()

		switch (req.method) {
			case 'PUT': {
				// UPDATE operation only for admin
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)				
				await Library.updateOne({ _id: req.query.id }, { content: req.body.content })
				break
			}

			default:
				res.setHeader('Allow', ['PUT'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500).send('A server-side error has occured. Please try again later.')
	} finally {
		res.end()
	}
}

export default libraryHandler
