import { FormSchema } from '@pages/apply'

type ApplicationEmailToOfficerProps = {
	applicant: FormSchema
}

export default function ApplicationEmailToOfficer({ applicant }: ApplicationEmailToOfficerProps) {
	return (
		<>
			<p>New tutor application has been submitted.</p>

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
