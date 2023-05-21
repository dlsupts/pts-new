import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import statistics, { Aggregate, ComplexAggregate } from '@lib/statistics'

export type Statistics = [
	ComplexAggregate[],
	Aggregate[],
	Aggregate[],
	Aggregate[],
	Aggregate[],
	Aggregate[]
]

const handler = async (req: NextApiRequest, res: NextApiResponse<Statistics>) => {
	const { method } = req

	try {
		const session = await getSession({ req })
		if (session?.user.type != 'ADMIN') return res.status(403)

		await dbConnect()

		switch (method) {
			case 'GET': {
				const result = await Promise.all([
					statistics.groupSessionsbySubjectAndStatus(),
					statistics.groupTuteesByCollege(),
					statistics.groupTuteesByIdNumber(),
					statistics.groupTutorsByIdNumber(),
					statistics.groupTutorsByCourse(),
					statistics.getTopTutorPerSubject()
				])

				res.json(result)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default handler
