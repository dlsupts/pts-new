import {
	UserGroupIcon,
	GlobeAltIcon,
	LightningBoltIcon,
	AdjustmentsIcon,
	HeartIcon,
	ArrowSmUpIcon,
	MapIcon,
	UserAddIcon
} from '@heroicons/react/outline'

export const requests = [
	{
		name: 'Free of charge',
		description: 'Sessions with our tutors are completely free. No hidden fees, can you believe it?',
		icon: GlobeAltIcon,
	},
	{
		name: 'Flexible Schedule',
		description: 'When you want to schedule your sessions is up to you and your tutor. A consistent meetup or a one-time thing is all good with us.',
		icon: AdjustmentsIcon,
	},
	{
		name: 'Fast response',
		description: 'If you experience problems a peer tutor, please let us know, and we will try our best to resolve the issue immediately.',
		icon: LightningBoltIcon,
	},
	{
		name: 'Passionate Tutors',
		description: 'Here at PTS, we strongly believe that everyone can shine brightly. Our tutors will try their best to help you make that happen.',
		icon: UserGroupIcon,
	},
]

export const applications = [
	{
		name: 'Experiencing new things',
		description: 'We know, we know, "just another cliché non-paying-job catchphrase" you might say. But come on, experience goes a long way.',
		icon: ArrowSmUpIcon,
	},
	{
		name: 'Giving back',
		description: 'Having a good day? Why not thank the world by taking this chance to make another person\'s day.',
		icon: HeartIcon,
	},
	{
		name: 'Guiding others',
		description: 'Feel like your better than the profs? Use this as an opportunity to show off and put your teaching skills to the test.',
		icon: MapIcon,
	},
	{
		name: 'Forming strong bonds',
		description: 'Like what any other org would say, you can form new bonds and connections. Not just with your tutees but also your fellow tutors!',
		icon: UserAddIcon,
	},
]