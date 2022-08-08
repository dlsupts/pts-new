import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Library from '@models/library'

const libraryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const session = await getSession({ req })
		if (session?.user.type != 'ADMIN') return res.status(403)

		await dbConnect()

		switch (req.method) {
			case 'PUT': {
				const lib = await Library.findOneAndUpdate({ _id: req.query.id }, { content: req.body.content }).lean()
				if (lib?.revalidatePaths) {
					Promise.all(lib.revalidatePaths.map(path => res.revalidate(path)))
				}
				break
			}

			case 'DELETE': {
				const lib = await Library.findOneAndDelete({ _id: req.query.id }).lean()
				if (lib?.revalidatePaths) {
					Promise.all(lib.revalidatePaths.map(path => res.revalidate(path)))
				}
				break
			}

			default:
				res.setHeader('Allow', ['PUT', 'DELETE'])
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
