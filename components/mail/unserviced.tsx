import { IRequest } from '@models/request'
import { ISession } from '@models/session'

type UnservicedEmailProps = Pick<IRequest, 'duration'> & {
	sessions: Pick<ISession, 'subject'>[]
}

export function UnservicedEmail({ duration, sessions }: UnservicedEmailProps) {
	const subjects =
		<ol style={{ marginTop: 0 }}>
			{sessions.map(s => <li key={s.subject}>{s.subject}</li>)}
		</ol>

	if (duration == 'One Session') {
		return (
			<>
				<p>
					Thank you for availing PTS&apos; tutor request services. Unfortunately,
					we <strong>could not find an available tutor</strong> that could cater
					to your request for the following subject{sessions.length > 1 && 's'}:
					{subjects}
				</p>
				<p>
					Should you wish to request again, you may do so via <a href="https://dlsupts.vercel.app/request">https://dlsupts.vercel.app/request</a>
				</p>
				<p>
					You may also drop by our <a href="https://bit.ly/PTS_Discord_Server">Discord server</a> where our
					tutors can answer your questions on specific lessons and topics.
				</p>
				<p>
					Thank you!
				</p>
			</>
		)
	}

	return (
		<>
			<p>
				Thank you for availing of PTS&apos; tutor request services. Unfortunately,
				there are <strong>currently no available tutors</strong> that can
				cater to this whole term request for the following subject{sessions.length > 1 && 's'}:
				{subjects}
			</p>
			<p>
				However, a tutor will contact you once we match your request.
			</p>
			<p>
				In the meantime, you may submit a “One Session” request through <a href="https://dlsupts.vercel.app/request">https://dlsupts.vercel.app/request</a>
			</p>
			<p>
				You may also drop by our <a href="https://bit.ly/PTS_Discord_Server">Discord server</a> where
				our tutors can answer specific questions you may have on academic matters.
			</p>
			<p>
				Thank you!
			</p>
		</>
	)
}


