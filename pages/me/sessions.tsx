import { NextPage } from 'next'
import UserLayout from '../../components/user-layout'
import useSWR from 'swr'
import app from '../../lib/axios-config'
import { ISession } from '../../models/session'
import { IRequest } from '../../models/request'
import { ITutee } from '../../models/tutee'
import { Schema } from 'mongoose'
import LoadingSpinner from '../../components/loading-spinner'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import cn from 'classnames'
import { days } from '../../lib/times'
import styles from '../../styles/Sessions.module.css'

interface IReqSesssion {
	request: Pick<IRequest, 'duration' | 'tutorialType'> & {
		_id: Schema.Types.ObjectId
		tutee: ITutee
	}
	sessions: ISession[]
}

function useSessions() {
	const { data, error } = useSWR('/api/me/sessions', url => app.get<IReqSesssion[]>(url))
	return {
		sessions: data?.data,
		isLoading: !data && !error,
		isError: !!error
	}
}

const TutorSessions: NextPage = () => {
	const { sessions, isLoading, isError } = useSessions()

	if (isLoading) {
		return <UserLayout><LoadingSpinner className="h-96" /></UserLayout>
	} else if (isError) {
		return <UserLayout><p>An error has occured. Please try again.</p></UserLayout>
	}

	return (
		<UserLayout>
			{sessions?.map(({ request, sessions }) => (
				<Disclosure key={request._id.toString()}>
					{({ open }) => (
						<>
							<Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
								<span className="text-base">{request.tutee.firstName} {request.tutee.lastName}</span>
								<ChevronUpIcon className={cn({ 'transform rotate-180': open }, 'w-5 h-5 text-blue-500')} />
							</Disclosure.Button>
							<Disclosure.Panel className="sm:px-4 pt-4 pb-2 text-gray-900">
								<div className={styles['data-display']}>
									<div className={styles.header}>
										<h3>Tutorial Session</h3>
									</div>
									<div className={styles.content}>
										<div>
											<p className={styles.label}>Duration</p>
											<p className={styles.data}>{request.duration}</p>
										</div>
										<div>
											<p className={styles.label}>Tutorial Type</p>
											<p className={styles.data}>{request.tutorialType}</p>
										</div>
										<div>
											<p className={styles.label}>Subjects - Specific Topics</p>
											{sessions.map(({ subject, topics }) => (
												<p key={subject} className={styles.data}>{subject} - {topics}</p>
											))}
										</div>
									</div>
								</div>

								<div className={styles['data-display']}>
									<div className={styles.header}>
										<h3>Tutee Information</h3>
									</div>
									<div className={styles.content}>
										<div>
											<p className={styles.label}>Full Name</p>
											<p className={styles.data}>{request.tutee.firstName} {request.tutee.lastName}</p>
										</div>
										<div>
											<p className={styles.label}>ID Number</p>
											<p className={styles.data}>{request.tutee.idNumber.toString().substring(0, 3)}</p>
										</div>
										<div>
											<p className={styles.label}>College</p>
											<p className={styles.data}>{request.tutee.college}</p>
										</div>
										<div>
											<p className={styles.label}>Course</p>
											<p className={styles.data}>{request.tutee.course}</p>
										</div>
										<div>
											<p className={styles.label}>Campus</p>
											<p className={styles.data}>{request.tutee.campus}</p>
										</div>
										<div>
											<p className={styles.label}>Email Address</p>
											<p className={styles.data}>{request.tutee.email}</p>
										</div>
										<div>
											<p className={styles.label}>Contact Number</p>
											<p className={styles.data}>{request.tutee.contact}</p>
										</div>
										<div>
											<p className={styles.label}>Facebook Profile</p>
											<a href={request.tutee.url} target="_blank" rel="noreferrer" className={cn(styles.data, 'underline')}>{request.tutee.url}</a>
										</div>
										<div className='col-span-full'>
											<p className={styles.label}>Schedule</p>
											<table className="w-full shadow-sm">
												<tbody>
													{days.map((day, index) => (
														<tr key={day.key} className={cn({'bg-gray-100': index % 2})}>
															<td className="font-medium pl-2 sm:pl-6 w-32 sm:w-36">{day.text}</td>
															<td className="py-2" dangerouslySetInnerHTML={{ __html: request.tutee.schedule[day.key].join('<br>')}} />
														</tr>
													))
													}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
			))}
		</UserLayout>
	)
}

export default TutorSessions
