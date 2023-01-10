import { TuteePostAPIBody } from '@pages/api/requests/index'

type RequestEmailProps = TuteePostAPIBody & {
	toTutee: boolean
}

export default function RequestEmail({ toTutee, request, selectedSubjects, tutee }: RequestEmailProps) {
	return (
		<>
			<p>
				{toTutee ? 'Your request has been received. Please wait for our tutors to contact you through Facebook within three (3) days.'
					: 'A new tutor request has been submitted.'}
			</p>
			<div>
				<strong>Request Details</strong><br />
				Duration: <strong>{request.duration}</strong><br />
				Subjects:
				<ol style={{ marginTop: 0 }}>
					{selectedSubjects.map(([subject, topics]) => (
						<li key={subject}><strong>{subject}</strong>{topics && `- ${topics}`}</li>
					))}
				</ol>
			</div>

			<p>
				<strong>Tutee Information</strong><br />
				Name: <strong>{tutee.firstName} {tutee.lastName}</strong><br />
				ID Number: <strong>{tutee.idNumber}</strong><br />
				College: <strong>{tutee.college}</strong><br />
				Course: <strong>{tutee.course}</strong><br />
				Email: <strong><a href={`mailto:${tutee.email}`}>{tutee.email}</a></strong><br />
				Contact Number: <strong>{tutee.contact}</strong><br />
				Facebook Profile: <strong><a href={tutee.url}>{tutee.url}</a></strong><br />
				Campus: <strong>{tutee.campus}</strong><br />
			</p>
		</>
	)
}


