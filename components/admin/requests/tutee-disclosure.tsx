import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ITutee } from '@models/tutee'
import cn from 'classnames'
import styles from '@styles/Sessions.module.css'
import { BareSession, IReqSession } from '@pages/api/requests'
import tutorialTypes from '@lib/tutorial-types'
import ScheduleDisplay from '@components/schedule-display'
import { Tutor } from '@pages/admin/requests'

type TuteeDisclosureProps = {
	tutee?: ITutee
	request?: IReqSession
	sessions: BareSession[]
	tutors: Map<string, Tutor>
}

const TuteeDisclosure = ({ tutee, request, sessions, tutors }: TuteeDisclosureProps) => {
	const tutor = tutors.get(request?.preferred?.toString() || '')
	const preferred = tutor ? `${tutor?.firstName} ${tutor?.lastName}` : ''

	return (
		<>
			<Disclosure>
				{({ open }: { open: boolean }) => (
					<>
						<Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-4 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
							<span className="text-base">{tutee?.firstName} {tutee?.lastName}</span>
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
											<p className={styles.data}>{tutee?.idNumber.toString().substring(0, 3)}</p>
										</div>
										<div>
											<p className={styles.label}>College</p>
											<p className={styles.data}>{tutee?.college}</p>
										</div>
										<div>
											<p className={styles.label}>Course</p>
											<p className={styles.data}>{tutee?.course}</p>
										</div>
										<div>
											<p className={styles.label}>Campus</p>
											<p className={styles.data}>{tutee?.campus}</p>
										</div>
										<div>
											<p className={styles.label}>Email Address</p>
											<p className={styles.data}>{tutee?.email}</p>
										</div>
										<div>
											<p className={styles.label}>Contact Number</p>
											<p className={styles.data}>{tutee?.contact}</p>
										</div>
										<div className="col-span-full">
											<p className={styles.label}>Facebook Profile</p>
											<a href={tutee?.url} target="_blank" rel="noreferrer" className={cn(styles.data, 'underline')}>{tutee?.url}</a>
										</div>
										{tutee?.friends?.length != 0 &&
											<div className="col-span-full">
												<p className={styles.label}>Friends</p>
												<p className={styles.data}>{tutee?.friends?.join(', ')}</p>
											</div>
										}
										<div className="col-span-full">
											<p className={styles.label}>Schedule</p>
											<ScheduleDisplay schedule={tutee?.schedule} />
										</div>
									</div>
								</div>
							</Disclosure.Panel>
						</Transition>
					</>
				)}
			</Disclosure>
			<div className={styles['data-display']}>
				<div className={styles.content}>
					<div>
						<p className={styles.label}>Duration</p>
						<p className={styles.data}>{request?.duration}</p>
					</div>
					<div>
						<p className={styles.label}>Tutorial Type</p>
						<p className={styles.data}>{request?.duration == 'One Session' ?
							tutorialTypes['One Session'].find(t => t.value == request?.tutorialType)?.text : request?.tutorialType}</p>
					</div>
					{preferred &&
						<div>
							<p className={styles.label}>Preferred Tutor</p>
							<p className={styles.data}>{preferred}</p>
						</div>
					}
					<div className="col-span-full">
						<p className={styles.label}>Subject - Specific Topic</p>
						{sessions.map(({ subject, topics }) => (
							<p key={subject} className={styles.data}>{subject} {topics && `- ${topics}`}</p>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default TuteeDisclosure
