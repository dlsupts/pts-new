import { Schema, models, model, Model, ObjectId } from 'mongoose'
import { MongoID, role, service } from '../types'
import * as yup from 'yup'
import { ISchedule, ScheduleSchema, Schedule } from './schedule'

// this is extended by tutee schema, be careful of changes
export const userInfoSchema = yup.object({
	idNumber: yup.number().typeError('ID number is required.').required().min(11500000, 'Invalid ID number.').integer(),
	email: yup.string().trim().email().matches(/.*(@dlsu.edu.ph)$/, 'Should end with "@dlsu.edu.ph".').required('Email is required.'),
	firstName: yup.string().trim().required('First name is required.'),
	middleName: yup.string().trim(),
	lastName: yup.string().trim().required('Last name is required.'),
	course: yup.string().required('Course is required.'),
	terms: yup.number().typeError('Remaining terms is required.').positive('Input should be positive.').required('Remaining terms in required.').integer(),
	contact: yup.string().trim().matches(/\d*/, 'Only numerical input is allowed.').required('Contact number is required.'),
	url: yup.string().trim().url('Must include "https://"').matches(/facebook.com\/\w+/, 'Invalid format!').required('Facebook URL is required.'),
}).required()

export interface IUserInfo extends yup.InferType<typeof userInfoSchema> {
	_id: ObjectId
}

export interface ITutorInfo {
	membership: boolean
	tutoringService: service
	tutorialType: string[]
	tuteeCount: number
	maxTuteeCount: number
	topics: string[][],
	schedule: ISchedule
}

export interface IUser extends IUserInfo, ITutorInfo {
	userType: role
	reset: boolean
	lastActive: string
	// takes the value of lastActive upon term reset. This serves as a backup value when lastActive is updated, but has to be reset
	// use case: a user has set his max tutee > 0, so lastActive is set to the current term. However, he later changes it back to 0,
	// so the value of lastActive will now be reset to the value stored in storedLastActive
	storedLastActive: string
}

interface UserModel extends Model<IUser> {
	/**
	 * Updates the tutee count of a tutor
	 * @param shouldIncrement indicates if the update should be performed
	 * @param _id the ObjectId of the user to update
	 * @param value value to add to tuteeCount, defaults to 1
	 */
	incrementTuteeCount(shouldIncrement: boolean, _id: MongoID, value?: number): Promise<void>
	
	/**
	 * Updates the tutee count of a tutor and returns the old document before the updating
	 * @param shouldIncrement indicates if the update should be performed
	 * @param _id the ObjectId of the user to update
	 * @param value value to add to tuteeCount, defaults to 1
	 * @param projection string to specify the keys to return from the document
	 */
	incrementTuteeCount(shouldIncrement: boolean, _id: MongoID, value: number, projection: string): Promise<IUser | null>

	/**
	 * Batch update the tutee count of tutors
	 * @param ids array of ObjectIDs either in string or object format
	 * @param value value to add to tuteeCount, defaults to 1
	 */
	batchIncrementTuteeCount(ids: MongoID[], value?: number): Promise<void>
}

const userSchema = new Schema<IUser>({
	firstName: { type: String, default: '' },
	middleName: { type: String },
	lastName: { type: String, default: '' },
	idNumber: { type: Number, required: true, min: 0 },
	email: { type: String, required: true },
	course: { type: String, default: '' },
	contact: { type: String, default: '' },
	url: { type: String, default: '' },
	terms: { type: Number, default: 0, min: 0 },
	membership: { type: Boolean, default: true },
	tutoringService: [String], // [WHOLE TERM, ONE SESSION]
	tutorialType: [String],
	tuteeCount: { type: Number, default: 0, min: 0 },
	maxTuteeCount: { type: Number, default: 0, min: 0 },
	topics: [[String]],
	schedule: { type: ScheduleSchema, required: true, default: new Schedule() },
	userType: String, 	// [ADMIN, TUTOR]
	reset: Boolean,
	lastActive: String, // ayterm
}, { versionKey: false })

userSchema.statics.incrementTuteeCount = async function (shouldIncrement: boolean, _id: MongoID, value = 1, projection?: string): Promise<void> {
	if (shouldIncrement) {
		if (projection == undefined) {
			return await this.updateOne({ _id }, { $inc: { 'tuteeCount': value } })
		}
		return await this.findOneAndUpdate({ _id }, { $inc: { 'tuteeCount': value } }, { projection }).lean()
	}

	if (projection != undefined) {
		return await this.findById(_id, projection).lean()
	}
}

userSchema.statics.batchIncrementTuteeCount = async function (ids: MongoID[], value = 1): Promise<void> {
	await this.updateMany({ _id: { $in: ids } }, { $inc: { tuteeCount: value } })
}

export default models?.User as unknown as UserModel || model<IUser, UserModel>('User', userSchema, 'users')
