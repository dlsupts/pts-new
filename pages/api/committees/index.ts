import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import Committee from '@models/committee'
import Library from '@models/library'
import { getSession } from 'next-auth/react'

const committeeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				const session = await getSession({ req })
				if (session?.user.type != 'ADMIN') return res.status(403)

				const committees = await Committee.find().populate({
					path: 'officers.user',
					select: 'firstName lastName'
				}).lean()

				const order = await Library.findById('Committees').lean('-_id content').exec()

				// arrange committees based on order in library
				const arranged = order?.content?.map(o => committees.find(c => c.name == o))

				// parse names and id
				arranged?.forEach(c => c?.officers.forEach(o => {
					if (typeof o.user != 'string' && 'firstName' in o.user) {						
						o.name = o.user.firstName + ' ' + o.user.lastName						
						o.user = o.user._id.toString()
					} else {
						o.user = o.user.toString()
					}
				}))

				res.json(arranged)
				break
			}

			case 'POST': {
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default committeeHandler