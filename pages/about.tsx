import { GetStaticProps } from 'next'
import { FC } from 'react'
import CommiteeDiv from '../components/commitee'
import dbConnect from '../lib/db'
import Committee, { ICommittee } from '../models/committee'

interface AboutPageProps {
	committees: ICommittee[]
}

const AboutPage: FC<AboutPageProps> = ({ committees }) => {
	return (
		<div className="container mx-auto px-4 md:px-0">
			<div className="my-14">
				<p className="font-light text-5xl text-center">About Us</p>
				<hr className="mt-2 mb-6" />
				<p className="max-w-prose lg:text-center mx-auto text-lg">
					The <b className="text-blue-800">Peer Tutors Society (PTS)</b> is an initiative under the Office of the Associate Dean of College of Computer Studies.
					It is a society of volunteer students who are willing to serve as tutors to students who need academic assistance. PTS is unique to CCS.
					It is most probably the only one in the university, and most probably the only one, or at least one of the very few, in the country.
					PTS aims to select, train, qualify, and deploy a group of volunteer students in order to conduct individualized (one-on-one) or
					group studies / tutoring sessions for students in various subjects. Any tutoring session will primarily be characterized by individualized
					instruction (explaining and / or reviewing constructs, discussing solutions to sample programs) and remediation (providing corrections,
					giving hints and / or advice, coaching).
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-x-8 gap-y-8">
				<div className="rounded-md border flex flex-col items-center p-8">
					<i className="fa-solid fa-eye fa-3x mb-8"></i>
					<p className="max-w-prose text-center">
						A service-oriented tutoring organization that bridges gaps between students and faculty,
						caters to the different academic needs of CCS students and builds
						relationships with tutees not only as teachers but as friends.
					</p>
				</div>
				<div className="rounded-md border flex flex-col items-center p-8">
					<i className="fa-solid fa-rocket fa-3x mb-8"></i>
					<div className="max-w-prose text-center">
						<p>To share knowledge</p>
						<p>To inspire tutees and other students outside the organization</p>
						<p>To grow as a tutor, a tutee, and an individual </p>
					</div>
				</div>
			</div>

			<div>
				{committees.map(c => <CommiteeDiv key={c.name} name={c.name} officers={c.officers} />)}
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()
	const comms = await Committee.find({}, '-_id -__v').lean().exec()

	const committees = comms.map(c => {
		const officers = c.officers.map(o => ({ ...o, account: o.account.toString() }))

		return {
			...c,
			officers,
		}
	})

	return {
		props: {
			committees,
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default AboutPage