import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import cn from 'classnames'
import styles from '@styles/Sessions.module.css'
import ScheduleDisplay from '@components/schedule-display'
import { Request, Tutor } from '@pages/admin/requests'
import { useCallback } from 'react'
import { Schema } from 'mongoose'
import { IUser } from '@models/user'
import { ISession } from '@models/session'
import { formatDate } from '@lib/utils'

type TuteeDisclosureProps = {
	request: Request
	sessions: ISession[]
	tutors: Map<string, Tutor>
}

const TuteeDisclosure = ({ request, sessions, tutors }: TuteeDisclosureProps) => {
	const getTutorName = useCallback((id?: string | Schema.Types.ObjectId | IUser) => {
		const tutor = tutors.get(id?.toString() || '')
		return `${tutor?.firstName} ${tutor?.lastName}`
	}, [tutors])

	return (
		<>
			<Disclosure>
				{({ open }: { open: boolean }) => (
					<>
						<Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-4 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
							<span className="text-base">{request.tutee.firstName} {request.tutee.lastName}</span>
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

							<Disclosure.Panel className="pb-2 text-gray-900">
								<div className={styles['data-display']}>
									<div className={styles.content}>
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
										<div className="col-span-full">
											<p className={styles.label}>Facebook Profile</p>
											<a href={request.tutee.url} target="_blank" rel="noreferrer" className={cn(styles.data, 'underline')}>{request.tutee.url}</a>
										</div>
										{request.tutee.friends?.length != 0 &&
											<div className="col-span-full">
												<p className={styles.label}>Friends</p>
												<p className={styles.data}>{request.tutee.friends?.join(', ')}</p>
											</div>
										}
										<div className="col-span-full">
											<p className={styles.label}>Schedule</p>
											<ScheduleDisplay schedule={request.tutee.schedule} />
										</div>
									</div>
								</div>
							</Disclosure.Panel>
						</Transition>
					</>
				)}
			</Disclosure>
			<section className={styles['data-display']}>
				<div className={styles.content}>
					<div>
						<p className={styles.label}>Duration</p>
						<p className={styles.data}>{request.duration}</p>
					</div>
					<div>
						<p className={styles.label}>Tutorial Type</p>
						<p className={styles.data}>{request.tutorialType}</p>
					</div>
					{request.duration == 'One Session' &&
						<>
							<div>
								<p className={styles.label}>Earliest Date</p>
								<p className={styles.data}>{request.earliestDate && formatDate(request.earliestDate)}</p>
							</div>
							<div>
								<p className={styles.label}>Latest Date</p>
								<p className={styles.data}>{request.latestDate && formatDate(request.latestDate)}</p>
							</div>
						</>
					}

					{request.preferred &&
						<div>
							<p className={styles.label}>Preferred Tutor</p>
							<p className={styles.data}>{getTutorName(request.preferred)}</p>
						</div>
					}
					<div className="col-span-full">
						<p className={styles.label}>Subject - Specific Topic</p>
						{sessions.map(({ subject, topics, tutor }) => (
							<p key={subject} className={styles.data}>{subject} {tutor ? `(${getTutorName(tutor)})` : (topics && `- ${topics}`)}</p>
						))}
					</div>
				</div>
			</section>
		</>
	)
}

export default TuteeDisclosure
