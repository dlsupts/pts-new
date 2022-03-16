import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Session, { ISession } from '../../../models/session'
import Request from '../../../models/request'
import dbConnect from '../../../lib/db'

const mySessionsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req })

	// no session found
	if (session?.user?._id == null) {
		res.status(401)
		return res.end()
	}

	const { _id } = session.user

	try {
		await dbConnect()

		switch (req.method) {
			case "GET": {
				const sessions = await Session.find({ tutor: _id }).lean().exec()
				const reqSessMap = new Map<string, ISession[]>()

				// create a mapping of unique requests to multiple sessions
				for (let i = 0; i < sessions.length; i++) {
					const reqId = sessions[i].request.toString()
					if (reqSessMap.has(reqId)) {
						reqSessMap.get(reqId)?.push(sessions[i])
					} else {
						reqSessMap.set(reqId, [sessions[i]])
					}
				}

				// populate unique requests and corresponding tutee and schedule
				const reqKeys = Array.from(reqSessMap.keys())
				const requests = await Request.find({ _id: { $in: reqKeys } }, 'duration tutorialType tutee').populate({
					path: 'tutee',
					select: '-__v',
					populate: 'schedule'
				}).lean().exec()

				// map request and sessions together
				const response = requests.map(request => ({
					request,
					sessions: reqSessMap.get(request._id.toString())
				}))
				res.send(response)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default mySessionsHandler