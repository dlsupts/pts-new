import { IRequest } from '@models/request'
import { ISession } from '@models/session'
import { ITutee } from '@models/tutee'

type AssignmentEmailProps = {
	request: Pick<IRequest, 'duration' | 'tutorialType'>
	subjects: ISession[]
	tutee: ITutee
}

export default function AssignmentEmail({ request, subjects, tutee }: AssignmentEmailProps) {
	return (
		<>
			<p>You have been assigned a new tutee!</p>
			<div style={{ margin: '20 0' }}>
				<strong>Request Details</strong><br />
				Duration: <strong>{request.duration}</strong><br />
				Tutorial Type: <strong>{request.tutorialType}</strong><br />
				Subjects:
				<ol style={{ marginTop: '0' }}>
					{subjects.map(({ subject, topics }) => (
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
				{tutee.friends && tutee.friends.length != 0 &&
					<>
						Friends:<br />
						{tutee.friends.map(f => <>{f} <br /></>)}
					</>
				}
			</p>
		</>
	)
}