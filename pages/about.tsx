import { GetStaticProps, NextPage } from 'next'
import CommiteeDiv from '../components/commitee'
import dbConnect from '../lib/db'
import Committee, { ICommittee } from '../models/committee'
import Library from '../models/library'
import Image from 'next/image'
import Head from 'next/head'
import { siteTitle } from '@components/layout'

interface AboutPageProps {
	committees: ICommittee[]
}

const META_DESCRIPTION = 'About page containing the organization\'s description, vision and mission, projects, activities, and officers.'
const PAGE_TITLE = `${siteTitle} | About`

const AboutPage: NextPage<AboutPageProps> = ({ committees }) => {
	return (
		<div className="container mx-auto px-4 lg:px-20">
			<Head>
				<title>{PAGE_TITLE}</title>
				<meta name="description" content={META_DESCRIPTION} />
				<meta name="og:title" content={PAGE_TITLE} />
				<meta name="og:description" content={META_DESCRIPTION} />
				<meta name="og:url" content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/about`} />
				<meta name="twitter:title" content={PAGE_TITLE} />
				<meta name="twitter:description" content={META_DESCRIPTION} />
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
				<div className="grid lg:grid-cols-2 lg:gap-x-6 gap-y-4 place-items-center mt-4 lg:mt-12">
					<div className="w-full">
						<Image src="/tutor-sessions.png" alt="Tutor Sessions" width={640} height={401} className="w-full"  />
					</div>
					<div>
						<p className="text-xl font-medium mb-4">Tutoring Sessions</p>
						<p className="w-max-prose mb-6">
							PTS provides tutorial services where students in need of academic assistance can request
							for a peer tutor throughout the term. Tutorial sessions can be for one session or
							for the whole term, and can be conducted one-on-one or in groups to cater to the
							needs of all Lasallians.
						</p>
					</div>
					<div className="w-full">
						<Image src="/mds-fgs.png" alt="Group Study" width={1295} height={649} className="w-full"  />
					</div>
					<div>
						<p className="text-xl font-medium mb-4">Midterms and Finals Group Study</p>
						<p className="w-max-prose mb-6">
							PTS conducts its midterms and finals group study sessions every term together with
							La Salle Computer Society (LSCS) during the weeks before the midterms and finals weeks,
							respectively. Through a combination of asynchronous and synchronous sessions, students
							can review with their peers and consult with available tutors to better prepare for their exams.
						</p>
					</div>
					<div className="w-full">
						<Image src="/tutorial-videos.png" alt="Tutorial Videos" width={640} height={351} className="w-full" />
					</div>
					<div>
						<p className="text-xl font-medium mb-4">Student Tutorial Videos</p>
						<p className="w-max-prose mb-3">
							In collaboration with LSCS, PTS prepares student tutorial videos in which tutors discuss
							first-year and second-year topics related to math and computer studies. Previous tutorial video
							topics include conditional statements, structures, and integration by parts, among others.
						</p>
						<p className="max-w-prose mb-6">
							The full playlist of available student tutorial videos can be accessed
							through this <a href="https://tinyurl.com/StudentTutorialsPlaylist" className="text-blue-600 font-bold hover:underline">link</a>.
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
			committees: arranged
		}
	}
}

export default AboutPage
