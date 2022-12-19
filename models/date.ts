import { Schema, models, model, Model } from 'mongoose'

export interface IDate {
	_id: string
	start: Date | string
	end: Date | string
}

interface DateModel extends Model<IDate> {
	/**
	 * Gets the AYTerm object of the given timestamp
	 * 
	 * @param timestamp - a Date object that represents the timestamp. Uses the current timestamp if no date was given.
	 * @param allowFallback - a boolean variable to see if a fallback is allowed in case no matches were found
	 * @returns the a matching AYTerm for the timestamp if found. Otherwise, returns the latest AYTerm found only if fallback is allowed
	 */
	getAYTerm(timestamp?: Date, allowFallback?: boolean): Promise<IDate>
}

const dateSchema = new Schema<IDate>({
	_id: { type: String, required: true },
	start: { type: Date, required: true },
	end: { type: Date, required: true }
}, { versionKey: false })

dateSchema.statics.getAYTerm = async function (timestamp = new Date(), allowFallback = false) {
	const term: IDate | null = await this.findOne({
		_id: { $regex: '^(AY).*' },
		start: { $lt: timestamp },
		end: { $gt: timestamp }
	}).lean()

	if (term != null) return term

	if (allowFallback) {
		return await this.findOne({ _id: { $regex: '^(AY).*' } }).sort({ 'start': -1 }).limit(1).lean()
	}

	throw Error('No term definition found!')
}

export default models.Date as unknown as DateModel || model<IDate>('Date', dateSchema, 'dates')
