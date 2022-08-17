import { createLogger, transports, format } from 'winston'
import 'winston-mongodb'

const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info',
	transports: [
		new transports.Console({
			format: format.prettyPrint()
		}),
		new transports.MongoDB({
			db: process.env.MONGODB_URI,
			collection: 'logs',
			options: { useUnifiedTopolgy: true },
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
