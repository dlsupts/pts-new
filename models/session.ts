import { Schema, models, model, Model, Document } from 'mongoose'

export interface ISession {
	title: string
	content: string[]
}

const sessionSchema = new Schema({
	timestamp: String,
	academicYear: String,
	term: Number,
	duration: String,
	tutorialType: String,
	subjects: [String],
	topics: String,
	status: String, // Matched, Pending, No Match
	preferred: {
		type: Schema.Types.ObjectId,
		ref: 'Account'
	},
	tutor: {
		type: Schema.Types.ObjectId,
		ref: 'Account'
	},
	tutee: {
		type: Schema.Types.ObjectId,
		ref: 'Tutee'
	},
	seen: Boolean
})

export default models.TutorialSession as Model<ISession & Document> || model<ISession>('TutorialSession', sessionSchema, 'tutorial_sessions')
