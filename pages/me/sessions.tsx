import { NextPage } from 'next'
import UserLayout from '@components/user-layout'
import LoadingSpinner from '@components/loading-spinner'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import cn from 'classnames'
import { days } from '@lib/times'
import tutorialTypes from '@lib/tutorial-types'
import styles from '@styles/Sessions.module.css'
import { useRetriever } from '@lib/useRetriever'
import { IReqSesssion } from '@pages/api/me/sessions'

const TutorSessions: NextPage = () => {
	const { data: sessions, isLoading, isError } = useRetriever<IReqSesssion[]>('/api/me/sessions')

	if (isLoading) {
		return <UserLayout><LoadingSpinner className="h-96" /></UserLayout>
	} else if (isError) {
		return <UserLayout><p>An error has occured. Please try again.</p></UserLayout>
	}

	if (!sessions?.length) {
		return (
			<UserLayout>
				<div className="h-96 flex justify-center items-center">
					<h1 className="text-center text-2xl font-medium text-gray-400">No Sessions Yet</h1>
				</div>
			</UserLayout>
		)
	}

	return (
		<UserLayout>
			{sessions?.map(({ _id, sessions, tutee, duration, tutorialType }) => (
				<Disclosure key={_id.toString()}>
					{({ open }: { open: boolean }) => (
						<>
							<Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-4 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
								<span className="text-base">{tutee.firstName} {tutee.lastName}</span>
								<ChevronDownIcon className={cn({ 'transform rotate-180': open }, 'w-5 h-5 text-blue-500')} />
							</Disclosure.Button>
							<Transition
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0"
							>

								<Disclosure.Panel className="sm:px-4 pb-2 text-gray-900">
									<div className={styles['data-display']}>
										<div className={styles.header}>
											<h3>Tutorial Session</h3>
										</div>
										<div className={styles.content}>
											<div>
												<p className={styles.label}>Duration</p>
												<p className={styles.data}>{duration}</p>
											</div>
											<div>
												<p className={styles.label}>Tutorial Type</p>
												<p className={styles.data}>{duration == 'One Session' ?
													tutorialTypes['One Session'].find(t => t.value == tutorialType)?.text : tutorialType}</p>
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
												<p className={styles.data}>{tutee.firstName} {tutee.lastName}</p>
											</div>
											<div>
												<p className={styles.label}>ID Number</p>
												<p className={styles.data}>{tutee.idNumber.toString().substring(0, 3)}</p>
											</div>
											<div>
												<p className={styles.label}>College</p>
												<p className={styles.data}>{tutee.college}</p>
											</div>
											<div>
												<p className={styles.label}>Course</p>
												<p className={styles.data}>{tutee.course}</p>
											</div>
											<div>
												<p className={styles.label}>Campus</p>
												<p className={styles.data}>{tutee.campus}</p>
											</div>
											<div>
												<p className={styles.label}>Email Address</p>
												<p className={styles.data}>{tutee.email}</p>
											</div>
											<div>
												<p className={styles.label}>Contact Number</p>
												<p className={styles.data}>{tutee.contact}</p>
											</div>
											<div>
												<p className={styles.label}>Facebook Profile</p>
												<a href={tutee.url} target="_blank" rel="noreferrer" className={cn(styles.data, 'underline')}>{tutee.url}</a>
											</div>
											{tutee.friends?.length &&
												<div className="col-span-full">
													<p className={styles.label}>Friends</p>
													<p className={styles.data}>{tutee.friends.join(', ')}</p>
												</div>
											}
											<div className="col-span-full">
												<p className={styles.label}>Schedule</p>
												<table className="w-full shadow-sm">
													<tbody>
														{days.map((day, index) => (
															<tr key={day.key} className={cn({ 'bg-gray-100': index % 2 })}>
																<td className="font-medium pl-2 py-2 sm:pl-6 w-32 sm:w-36">{day.text}</td>
																<td className="py-2" dangerouslySetInnerHTML={{ __html: tutee.schedule[day.key].join('<br>') }} />
															</tr>
														))
														}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</Disclosure.Panel>
							</Transition>
						</>
					)}
				</Disclosure>
			))}
		</UserLayout>
	)
}

export default TutorSessions
