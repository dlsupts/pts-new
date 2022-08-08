import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import Committee from '@models/committee'
import Library from '@models/library'
import { getSession } from 'next-auth/react'

const committeeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				const committees = await Committee.find().populate({
					path: 'officers.user',
					select: 'firstName lastName userType'
				}).lean()

				const order = await Library.findById('Committees').lean('-_id content').exec()

				// arrange committees based on order in library
				const arranged = order?.content?.map(o => committees.find(c => c.name == o))

				// parse names and id
				arranged?.forEach(c => c?.officers.forEach(o => {
					if (typeof o.user != 'string' && 'firstName' in o.user) {
						o.name = o.user.firstName + ' ' + o.user.lastName
						o.userType = o.user.userType
						o.user = o.user._id.toString()
					} else {
						o.user = o.user.toString()
					}
				}))

				res.json(arranged)
				break
			}

			case 'POST': {
				await Promise.all([
					Committee.create({ name: req.body.name }),
					Library.updateOne(
						{ _id: 'Committees' },
						{ $push: { content: req.body.name } }
					)
				])
				await res.revalidate('/about')
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