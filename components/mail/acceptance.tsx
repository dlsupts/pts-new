import { IUserInfo } from '@models/user'

export default function AcceptanceEmail(applicant: IUserInfo) {
	return (
		<>
			<p>Good day, {applicant.firstName}</p>
			<p>We are glad to inform you that you have <b>passed</b> the application interview and are officially a tutor of the Peer Tutors Society!</p>
			<p>With this, all new members must attend <b>Tutoring 101</b>.</p>
			<ul>
				<li>
					<b>Tutoring 101</b> will be held virtually on <b>October 7, 2023</b>, from <b>4 pm</b> to <b>5 pm</b> in <b>Zoom</b>. More details will be sent in the coming days.
				</li>
			</ul>
			<p>
				Please check your message requests on Facebook Messenger for an invitation to our PTS Tutors group chat.
			</p>
			<p><em>Share. Inspire. Grow.</em></p>
		</>
	)
}
