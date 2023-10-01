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
				Please reply with your active Facebook account link as soon as possible so that we may add you to our social media groups.
				Thank you and we are looking forward to having you here with us in PTS!
			</p>
		</>
	)
}
