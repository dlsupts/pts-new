import { Schema, models, model, Model } from 'mongoose'
import { IUser } from './user'
import './user' // force import in case of query population
import { role } from '@types'

const VICE_PRESIDENT_TEXT = 'Vice President'

type CommitteeEmails = {
	VP: string
	AVP: string[]
}

export interface IOfficer {
	user: Schema.Types.ObjectId | IUser | string;
	name?: string; // frontend firstName + lastName
	userType: role; // frontend
	position: string;
	image: string;
}

export interface ICommittee {
	_id: Schema.Types.ObjectId
	name: string;
	officers: IOfficer[];
}

interface CommitteModel extends Model<ICommittee> {
	/**
	 * Gets the email of the current VP of the given commitee
	 * @param name - committee name
	 * @return a promise that returns the email
	 */
	getVPEmail(name: string): Promise<string>
	/**
	 * Gets the email of the current VP of the given commitee
	 * @param name - committee name
	 * @return a promise that returns the email addresses of the VP and the AVPs
	 */
	getEmailAddresses(name: string): Promise<CommitteeEmails>
}

const committeeSchema = new Schema<ICommittee>({
	name: { type: String, required: true },
	officers: [{
		_id: false,
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		position: { type: String, required: true },
		image: { type: String, required: true },
	}]
})

committeeSchema.statics.getVPEmail = async function (name: string) {
	const [{ email }] = await this.aggregate()
		.match({ name })
		.unwind('$officers')
		.match({ 'officers.position': VICE_PRESIDENT_TEXT })
		.lookup({
			from: 'users',
			localField: 'officers.user',
			foreignField: '_id',
			as: 'officer'
		})
		.replaceRoot({ email: { $first: '$officer.email' } })

	return email
}

committeeSchema.statics.getEmailAddresses = async function (name: string) {
	const data = await this.aggregate()
		.match({ name })
		.unwind('$officers')
		.lookup({
			from: 'users',
			localField: 'officers.user',
			foreignField: '_id',
			as: 'officer'
		})
		.group({
			_id: '$officers.position',
			emails: { $push: { $first: '$officer.email' } }
		})

	const emails = data.reduce((acc: CommitteeEmails, e) => {
		if (e._id == 'Vice President' && e.emails) {
			acc.VP = e.emails[0]
		} else {
			acc.AVP.push(...e.emails)
		}
		return acc
	}, { VP: '', AVP: [] } as CommitteeEmails)

	return emails
}

export default models.Committee as unknown as CommitteModel || model<ICommittee, CommitteModel>('Committee', committeeSchema, 'committees')
