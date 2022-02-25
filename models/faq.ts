import { Schema, models, model, Model, Document } from 'mongoose'

export interface IFAQ {
	_id: Schema.Types.ObjectId | string
	question: string
	answer: string
}

interface IFAQs {
	type: string
	faqs: IFAQ[]
}

const faqSchema = new Schema<IFAQs>({
	type: { type: String, required: true },
	faqs: [{
		question: { type: String, required: true },
		answer: { type: String, required: true },
	}]
})

export default models.FAQ as Model<IFAQs & Document> || model<IFAQs>('FAQ', faqSchema, 'faqs')
