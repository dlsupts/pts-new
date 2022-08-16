import { GetStaticProps, NextPage } from 'next'
import CommiteeDiv from '../components/commitee'
import dbConnect from '../lib/db'
import Committee, { ICommittee } from '../models/committee'
import Library, { ILib } from '../models/library'
import Image from 'next/image'
import Head from 'next/head'
import { siteTitle } from '@components/layout'

interface AboutPageProps {
	committees: ICommittee[]
	sessionPhotos: ILib
	groupPhotos: ILib
}

const AboutPage: NextPage<AboutPageProps> = ({ committees, sessionPhotos, groupPhotos }) => {
	const sess = sessionPhotos.content.length == 0 ?
		'https://via.placeholder.com/480x360' :
		`https://drive.google.com/uc?export=view&id=${sessionPhotos.content[0].trim()}`

	const group = groupPhotos.content.length == 0 ?
		'https://via.placeholder.com/480x360' :
		`https://drive.google.com/uc?export=view&id=${groupPhotos.content[0].trim()}`

	return (
		<div className="container mx-auto px-4 lg:px-20">
			<Head>
				<title>{siteTitle} | About</title>
			</Head>
			<div className="my-14">
				<p className="font-light text-5xl text-center">About Us</p>
				<hr className="mt-2 mb-6" />
				<div className="contents lg:text-center text-lg space-y-6">
					<p className="max-w-prose mx-auto">
						The <b className="text-blue-800">Peer Tutors Society (PTS)</b> is an initiative under the Office of the
						Associate Dean of the College of Computer Studies (CCS). Established in 2002, it aims to select, train,
						qualify, and deploy a group of volunteer student tutors to conduct one-on-one and group tutoring sessions
						for first- and second-year students. The subjects covered are courses related to math and computer studies.
					</p>
					<p className="max-w-prose mx-auto">
						Aside from its flagship tutorial services, PTS spearheads and partners in activities that facilitate
						the academic growth of Lasallians through college-wide group studies, reviewer distributions,
						tutorial videos, and programming contests.
					</p>
					<p className="max-w-prose mx-auto">
						As a service-oriented organization that provides academic assistance not only to CCS students but also
						to all students from across the University&apos;s colleges, PTS is one of the few initiatives in the University
						that offer free student-facilitated tutorial services.
					</p>
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-x-8 gap-y-8">
				<div className="rounded-md border flex flex-col items-center p-8">
					<i className="fa-solid fa-eye fa-3x mb-4"></i>
					<h3 className="text-center text-xl font-semibold mb-2">Vision</h3>
					<p className="max-w-prose text-center">
						The Peer Tutors Society envisions itself as a service-oriented tutor organization
						working hand in hand with the College of Computer Studies in catering to the academic needs
						of the students of the University and in nurturing the holistic development of tutors and tutees.
					</p>
				</div>
				<div className="rounded-md border flex flex-col items-center p-8">
					<i className="fa-solid fa-rocket fa-3x mb-4"></i>
					<h3 className="text-center text-xl font-semibold mb-2">Mission</h3>
					<div className="max-w-prose text-center">
						The Peer Tutors Society commits itself to:
						<ol className="list-decimal text-left">
							<li className="ml-4">Sharing knowledge through activities that enrich the learning process;</li>
							<li className="ml-4">Inspiring the development of tutors and tutees through training programs; and</li>
							<li className="ml-4">Growing as an organization that promotes excellence in computer studies.</li>
						</ol>
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

	const data = await Promise.all([
		Committee.find({}, '-_id -__v')
			.populate({ path: 'officers', populate: { path: 'user', select: 'firstName lastName' } }).lean().exec(),
		Library.findById('Committees').lean('-_id content').exec(),
		Library.findById('Tutoring Sessions Photos', '-__v').lean().exec(),
		Library.findById('Group Studies Photos', '-__v').lean().exec(),
	])

	// arrange committees based on order in library
	const arranged = data[1]?.content?.map(o => data[0].find(c => c.name == o))

	// parse names
	arranged?.forEach(c => c?.officers.forEach(o => {
		if (typeof o.user != 'string') {
			if ('firstName' in o.user) {
				o.name = o.user.firstName + ' ' + o.user.lastName
				o.user = o.user._id.toString()
			} else {
				o.user = o.user.toString()
			}
		}
	}))

	return {
		props: {
			committees: arranged,
			sessionPhotos: data[2],
			groupPhotos: data[3],
		}
	}
}

export default AboutPage
