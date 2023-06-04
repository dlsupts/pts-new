import { IUserInfo } from '@models/user'

export default function AcceptanceEmail(applicant: IUserInfo) {
	return (
		<>
			<p>Good day, {applicant.firstName}</p>
			<p>We are glad to inform you that you have passed the application interview and are officially a tutor of the Peer Tutors Society!</p>
			<p>With this, all new members are required to attend two (2) upcoming events, the General Assembly and Tutoring 101.</p>
			<ul>
				<li>
					The <b>General Assembly</b> will be held on <b>June 7, 2023</b>, from <b>4 pm to 6 pm in Zoom</b>. Kindly answer
					the <a href="https://forms.gle/DJY954ueh5qM3BBa8">New Tutors Form</a> within the day.
				</li>
				<li>
					<b>Tutoring 101</b> will be held virtually on <b>June 10, 2023, from 4 pm to 5 pm in Zoom</b>.
					More details will be sent in the coming days.
				</li>
			</ul>
			<p>
				Please reply with your active Facebook account link as soon as you can so that we may add you to our social media groups.
				Thank you and we are looking forward to having you here with us in PTS!
			</p>
		</>
	)
}
