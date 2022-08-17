import { createLogger, transports, format } from 'winston'
import 'winston-mongodb'

const level = process.env.LOG_LEVEL || 'info'

const logger = createLogger({
	level,
	transports: [
		new transports.Console({
			level: process.env.NODE_ENV == 'production' ? 'error' : level,
			format: format.combine(format.prettyPrint(), format.colorize())
		}),
		new transports.MongoDB({
			db: process.env.MONGODB_URI,
			collection: 'logs',
			options: { useUnifiedTopology: true },
			level: 'info',
			tryReconnect: true,
		})
	],
	exceptionHandlers: [
		new transports.MongoDB({
			db: process.env.MONGODB_URI,
			collection: 'exceptions',
			options: { useUnifiedTopology: true },
			tryReconnect: true,
		})
	],
	format: format.combine(format.timestamp(), format.json()),
})

export default logger
