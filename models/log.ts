import { Schema, models, Model, model } from 'mongoose'

export const LOG_LEVELS = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6
} as const

export type LOG_LEVEL = keyof typeof LOG_LEVELS

export interface ILog {
	timestamp: Date
	level: LOG_LEVEL
	message: string
}

const logSchema = new Schema<ILog>({
	timestamp: { type: Date, required: true, default: new Date() },
	level: { type: String, required: true },
	message: { type: String, required: true },
}, { versionKey: false })

export default models?.Log as Model<ILog> || model<ILog>('Log', logSchema, 'logs')
