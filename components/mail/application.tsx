import { FormSchema } from '@pages/apply'

type ApplicationEmail = {
	applicant: FormSchema
	isApplicant: boolean
}

export default function ApplicationEmail({ applicant, isApplicant }: ApplicationEmail) {
	return (
		<>
			{isApplicant ?
				<>
					<p><strong>Thank you for applying to become a tutor in PTS!</strong></p>
					<p>We have received your application. Please wait to be contacted by the Activities Committee for further instructions.</p>
				</>
				:
				<p>New tutor application has been submitted.</p>
			}

			<p>
				<strong>Applicant Details</strong><br />
				Name: <strong>{applicant.firstName} {applicant.middleName} {applicant.lastName}</strong><br />
				ID Number: <strong>{applicant.idNumber}</strong><br />
				Email: <strong><a href={`mailto:${applicant.email}`}>{applicant.email}</a></strong><br />
				Course: <strong>{applicant.course}</strong><br />
				Contact Number: <strong>{applicant.contact}</strong><br />
				Terms Left: <strong>{applicant.terms}</strong><br />
				Facebook URL: <strong><a href={applicant.url}>{applicant.url}</a></strong><br />
			</p>
		</>
	)
}
