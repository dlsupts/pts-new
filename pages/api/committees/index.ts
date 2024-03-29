import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import Committee from '@models/committee'
import Library from '@models/library'
import { getSession } from 'next-auth/react'
import logger from '@lib/logger'

const committeeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)

	try {
		await dbConnect()

		switch (method) {
			case 'GET': {
				const [committees, order] = await Promise.all([
					Committee.find().populate({
						path: 'officers.user',
						select: 'firstName lastName userType'
					}).lean(),
					Library.findById('Committees').lean('-_id content').exec()
				])

				// arrange committees based on order in library
				const arranged = order?.content?.map(o => committees.find(c => c.name == o))

				// parse names and id
				arranged?.forEach(c => c?.officers.forEach(o => {
					// this case wil happen if a user, who is also an officer, is deleted
					if (o.user == null) return

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
				logger.info(`ADMIN [${session.user._id}] CREATED committee ${req.body.name}`)

				await res.revalidate('/about')
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		logger.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default committeeHandler