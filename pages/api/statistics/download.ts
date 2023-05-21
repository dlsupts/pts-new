import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@lib/db'
import { getSession } from 'next-auth/react'
import statistics, { Aggregate, ComplexAggregate } from '@lib/statistics'
import JSZip from 'jszip'
import Dates from '@models/date'
import { parse } from 'json2csv'

const fileNames = [
	'sessions',
	'tutees-college',
	'tutees-id',
	'tutors-id',
	'tutors-course',
	'top-tutors-per-subject'
] as const

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	try {
		const session = await getSession({ req })
		if (session?.user.type != 'ADMIN') return res.status(403)

		await dbConnect()

		switch (method) {
			case 'GET': {
				const prefix = `[${(await Dates.getAYTerm(undefined, true))._id}]`
				const zip = new JSZip()

				const results = await Promise.all([
					statistics.groupSessionsbySubjectAndStatus(),
					statistics.groupTuteesByCollege(),
					statistics.groupTuteesByIdNumber(),
					statistics.groupTutorsByIdNumber(),
					statistics.groupTutorsByCourse(),
					statistics.getTopTutorPerSubject(),
				])

				results.map((data, index) => {
					if (typeof data[0]._id == 'string') {
						zip.file(`${prefix}-${fileNames[index]}.csv`, parse(data as Aggregate[]))
					} else {
						const newData = (data as ComplexAggregate[]).map(d => ({ ...d._id, count: d.count })) as Aggregate[]
						zip.file(`${prefix}-${fileNames[index]}.csv`, parse(newData))
					}
				})

				const blob = await zip.generateAsync({ type: 'base64' })
				res.send(blob)
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
