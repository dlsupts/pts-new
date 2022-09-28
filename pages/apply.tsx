import { GetStaticProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import dbConnect from '../lib/db'
import Library from '../models/library'
import cn from 'classnames'
import { parseContent } from '@lib/utils'
import { useRetriever } from '@lib/useRetriever'
import { IDate } from '@models/date'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import dynamic from 'next/dynamic'

interface RequestProps {
	faqs: string[][]
	courses: string[]
}

const PAGE_TITLE = `${siteTitle} | Apply`
const META_DESCRIPTION = 'Feeling the fire to volunteer and teach? Send us your application now!'

const ApplicationForm = dynamic(() => import('@components/application-form'))

const RequestPage: NextPage<RequestProps> = ({ faqs, courses }) => {
	const [help, setHelp] = useState(faqs[0][1])
	const [showForm, setShowForm] = useState(false)
	const [applyError, setApplyError] = useState('Checking availability...')

	const { data: date } = useRetriever<IDate>('/api/dates/Tutor Recruitment')
	const { data: isMaintenance } = useRetriever<boolean>('/api/maintenance')

	useEffect(() => {
		if (date == undefined || isMaintenance == undefined) return
		if (isMaintenance) return setApplyError('System is in maintenance mode.')

		const today = new Date().getTime()
		if (today < new Date(date.start).getTime()) return setApplyError('Application period has not yet started!')
		if (today > new Date(date.end).getTime()) return setApplyError('Application period has passed!')
		setApplyError('')
	}, [isMaintenance, date])

	return (
		<div className="main-height flex flex-col justify-center px-4 mt-10 md:mt-0">
			<Head>
				<title>{PAGE_TITLE}</title>
				<meta name="description" content={META_DESCRIPTION} />
				<meta name="og:title" content={PAGE_TITLE} />
				<meta name="og:description" content={META_DESCRIPTION} />
				<meta name="og:url" content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/apply`} />
				<meta name="twitter:title" content={PAGE_TITLE} />
				<meta name="twitter:description" content={META_DESCRIPTION} />
			</Head>
			<div className="grid place-items-center lg:grid-cols-2 grid-cols-auto mx-auto min-h-[20rem] container gap-y-8">
				{showForm ?
					<ApplicationForm courses={courses} onSubmit={() => setShowForm(false)} />
					:
					<div className="flex flex-col items-center py-16">
						<div className="mb-6">
							<i className="fa-solid fa-chalkboard-user fa-4x"></i>
						</div>
						<p className="font-bold text-2xl text-center">Tutor Recruitment</p>
						<p className="text-gray-500 text-center mb-8 max-w-prose">Share your knowledge, inspire others, and grow as a peer tutor.</p>
						<button className="btn blue rounded-md px-4 py-2 font-medium" onClick={() => setShowForm(true)}
							disabled={applyError !== ''}>{applyError === '' ? 'Apply Now' : applyError}</button>
					</div>
				}
				<div className={cn({ 'lg:border-l': !showForm }, "flex flex-col justify-center items-center py-16 w-full lg:pl-8 border-gray-300 lg:border-t-0 border-t lg:h-full")}>
					<div className="mb-6">
						<i className="fa-solid fa-circle-question fa-4x"></i>
					</div>
					<p className="font-bold text-2xl text-center mb-2">Frequently Asked Questions</p>
					<select onChange={e => setHelp(e.target.value)}
						className="w-full max-w-prose border px-3 py-1.5 bg-clip-padding rounded transition ease-in-out cursor-pointer text-sm sm:text-base">
						{faqs.map(f => <option key={f[0]} value={f[1]} className="py-2">{f[0]}</option>)}
					</select>
					<p className="max-w-prose mt-6 font-black text-center min-h-[120px] lg:min-h-[75px]">{help}</p>
				</div>
			</div>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()

	const data = await Promise.all([
		Library.getDegreeCodes(),
		Library.findById('Tutor Recruitment FAQ', '-_id').lean().exec()
	])

	return {
		props: {
			courses: data[0],
			faqs: data[1]?.content.map(f => parseContent(f)),
		},
	}
}

export default RequestPage
