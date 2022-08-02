import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ITutee } from '@models/tutee'
import cn from 'classnames'
import { days } from '@lib/times'
import styles from '@styles/Sessions.module.css'
import { IReqSession } from '@pages/api/requests'
import tutorialTypes from '@lib/tutorial-types'

type TuteeDisclosureProps = {
	tutee?: ITutee
	request?: IReqSession
}

const TuteeDisclosure = ({ tutee, request }: TuteeDisclosureProps) => {
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
											<table className="w-full shadow-sm">
												<tbody>
													{days.map((day, index) => (
														<tr key={day.key} className={cn({ 'bg-gray-100': index % 2 })}>
															<td className="font-medium pl-2 py-2 sm:pl-6 w-32 sm:w-36">{day.text}</td>
															<td className="py-2" dangerouslySetInnerHTML={{ __html: tutee?.schedule[day.key].join('<br>') || '' }} />
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
			<div className={styles['data-display']}>
				<div className={styles.header}>
					<h3>Tutorial Session</h3>
				</div>
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
					<div>
						<p className={styles.label}>Subject - Specific Topic</p>
						<p className={styles.data}>{request?.session.subject} - {request?.session.topics}</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default TuteeDisclosure
