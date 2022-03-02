import { GetStaticProps, NextPage } from 'next'
import CommiteeDiv from '../components/commitee'
import dbConnect from '../lib/db'
import Committee, { ICommittee } from '../models/committee'
import Library, { ILib } from '../models/library'
import Image from 'next/image'

interface AboutPageProps {
	committees: ICommittee[]
	sessionPhotos: ILib
	groupPhotos: ILib
}

const AboutPage: NextPage<AboutPageProps> = ({ committees, sessionPhotos, groupPhotos }) => {
	const sess = sessionPhotos.content.length == 0 ?
		'https://via.placeholder.com/480x360' :
		`https://drive.google.com/uc?export=view&id=${sessionPhotos.content[0].split(':')[1].trim()}`

	const group = groupPhotos.content.length == 0 ?
		'https://via.placeholder.com/480x360' :
		`https://drive.google.com/uc?export=view&id=${groupPhotos.content[0].split(':')[1].trim()}`

	return (
		<div className="container mx-auto px-4 lg:px-20">
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

			<div className="mt-16">
				<p className="font-light text-4xl text-center mb-2">Activities</p>
				<hr />
				<div className="grid lg:grid-cols-2 lg:gap-x-6 gap-y-4 place-items-center mt-12">
					<div>
						<Image src={sess} alt="Tutor Sessions" width={480} height={360} />
					</div>
					<div>
						<p className="text-xl font-medium mb-4">Tutoring Sessions</p>
						<p className="w-max-prose">
							Peer Tutors Society (PTS) has been providing tutorial services each term and
							publicizing them through its Facebook page and Twitter account where students
							who are in need of academic assistance can request for a peer tutor. Tutor requests
							can either be for whole-term tutoring or for one-session tutoring, and can either be
							One-on-One sessions or Group sessions to accomodate the needs of all students.
						</p>
					</div>
					<div>
						<Image src={group} alt="Group Study" width={480} height={360} />
					</div>
					<div>
						<p className="text-xl font-medium mb-4">Midterms and Finals Group Study</p>
						<p className="w-max-prose">
							Peer Tutors Society (PTS) conducts its termly Midterms and Finals Group Study sessions together
							with La Salle Computer Society (LSCS) during the week before Midterms and Finals Week. These group
							studies will not only focus on reviewing the lectures and problem sets needed by the students to ace
							their exams, but also share useful tips on how to better understand different concepts and theories to
							better prepare these students for their upcoming Midterms and Finals Exams.
						</p>
					</div>
				</div>
			</div>

			<div className="mt-16">
				<p className="font-light text-4xl text-center mb-2">Officers</p>
				<hr />
				{committees.map(c => <CommiteeDiv key={c.name} name={c.name} officers={c.officers} />)}
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()

	const committees = await Committee.find({}, '-_id -__v')
		.populate({ path: 'officers', populate: { path: 'user', select: 'firstname lastname' } }).lean().exec()

	// parse names
	committees.forEach(c => c.officers.forEach(o => {
		if (typeof o.user != 'string') {
			if ('firstName' in o.user) {
				o.name = o.user.firstName + ' ' + o.user.lastName
				o.user = o.user._id.toString()
			} else {
				o.user = o.user.toString()
			}
		}
	}))

	const sessionPhotos = await Library.findOne({ title: 'Tutoring Sessions Photos' }, '-_id -__v').lean().exec()
	const groupPhotos = await Library.findOne({ title: 'Group Studies Photos' }, '-_id -__v').lean().exec()

	return {
		props: {
			committees,
			sessionPhotos,
			groupPhotos,
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default AboutPage
