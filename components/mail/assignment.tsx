import { IRequest } from '@models/request'

type AssignmentEmailProps = {
	request: Pick<IRequest, 'duration' | 'tutorialType' | 'tutee' | 'sessions' | 'earliestDate' | 'latestDate'>
}

export default function AssignmentEmail({ request }: AssignmentEmailProps) {
	return (
		<>
			<p>You have been assigned a new tutee!</p>
			<div style={{ margin: '20 0' }}>
				<strong>Request Details</strong><br />
				Duration: <strong>{request.duration}</strong><br />
				Tutorial Type: <strong>{request.tutorialType}</strong><br />
				{request.earliestDate && <>Earliest Date: <strong>{request.earliestDate}</strong><br /></>}
				{request.latestDate && <>Latest Date: <strong>{request.latestDate}</strong><br /></>}
				Subjects:
				<ol style={{ marginTop: '0' }}>
					{request.sessions.map(({ subject, topics }) => (
						<li key={subject}><strong>{subject}</strong>{topics && ` - ${topics}`}</li>
					))}
				</ol>
			</div>
			<p>
				<strong>Tutee Information</strong><br />
				Name: <strong>{request.tutee.firstName} {request.tutee.lastName}</strong><br />
				ID Number: <strong>{request.tutee.idNumber}</strong><br />
				College: <strong>{request.tutee.college}</strong><br />
				Course: <strong>{request.tutee.course}</strong><br />
				Email: <strong><a href={`mailto:${request.tutee.email}`}>{request.tutee.email}</a></strong><br />
				Contact Number: <strong>{request.tutee.contact}</strong><br />
				Facebook Profile: <strong><a href={request.tutee.url}>{request.tutee.url}</a></strong><br />
				Campus: <strong>{request.tutee.campus}</strong><br />
				{request.tutee.friends && request.tutee.friends.length != 0 &&
					<>
						Friends:<br />
						{request.tutee.friends.map(f => <>{f} <br /></>)}
					</>
				}
			</p>
		</>
	)
}