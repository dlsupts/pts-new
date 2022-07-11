import { Schema, models, model, Model } from 'mongoose'

export interface ILib {
	_id: string
	isKeyed: boolean
	content: string[]
}

interface LibModel extends Model<ILib> {
	getDegreeCodes(): Promise<string[]>
}

const libSchema = new Schema<ILib>({
	_id: { type: String, required: true },
	isKeyed: { type: Boolean, required: true, default: false },
	content: { type: [String], required: true, default: [] },
})

libSchema.statics.getDegreeCodes = async function () {
	const { content }: ILib = await this.findById('Degree Programs', 'content').lean().exec()

	for (let i = 0; i < content.length; i++) {
		content[i] = content[i].split(':')[0]
	}

	return content
}


export default models.Library as unknown as LibModel || model<ILib, LibModel>('Library', libSchema, 'libraries')
