import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../lib/db'
import Schedule, { ISchedule } from '../../../models/schedule'

const scheduleHandler = async (req: NextApiRequest, res: NextApiResponse<ISchedule>) => {
	const session = await getSession({ req })
	
	// no session found
	if (session?.user?.schedule == null) {
		res.status(401)
		return res.end()
	}

	const schedule = session.user.schedule

	try {
		await dbConnect()

		switch (req.method) {
			case "GET": {
				const sched = await Schedule.findById(schedule, '-_id').lean().exec()
				if (sched == null) throw new Error('Schedule not found in registry!')
				res.send(sched)
				break
			}

			case "POST": {
				const sched = await Schedule.findOneAndUpdate({ _id: schedule }, req.body, { new: true, projection: '-_id' }).lean().exec()
				if (sched == null) throw new Error('Schedule not found in registry!')
				res.send(sched)
				break
			}
		}

	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default scheduleHandler