import Log, { LOG_LEVEL, LOG_LEVELS } from '@models/log'
import dbConnect from './db'

const THRESHOLD = LOG_LEVELS[process.env.LOG_LEVEL || 'info']

async function addLog(level: LOG_LEVEL, message: string | unknown) {
	if (LOG_LEVELS[level] <= THRESHOLD) {
		await dbConnect()
		await Log.create({ level, message })

		if (process.env.NODE_ENV != 'production' || level == 'error') {
			console.log(message)
		}
	}
}

const logger = {
	error: (data: string | unknown) => addLog('error', data),
	warn: (data: string | unknown) => addLog('warn', data),
	info: (data: string | unknown) => addLog('info', data),
	http: (data: string | unknown) => addLog('http', data),
	verbose: (data: string | unknown) => addLog('verbose', data),
	debug: (data: string | unknown) => addLog('debug', data),
	silly: (data: string | unknown) => addLog('silly', data),
}

export default logger
