import Modal, { IModalProps } from '@components/modal'
import ScheduleDisplay from '@components/schedule-display'
import { Dialog } from '@headlessui/react'
import { ISchedule } from '@models/schedule'
import { Tutor } from '@pages/admin/requests'
import styles from '@styles/Modal.module.css'
import sessionStyles from '@styles/Sessions.module.css'
import { useRef } from 'react'

type TutorModalProps = IModalProps & {
	tutor?: Tutor
}

const TutorModal = ({ isOpen, onClose, tutor }: TutorModalProps) => {
	const header = useRef<HTMLDivElement>(null)

	return (
		<Modal isOpen={isOpen} close={onClose}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<div className={styles['title-container']} ref={header} tabIndex={0}>
						<Dialog.Title as="h3" className={styles.title}>{tutor?.firstName} {tutor?.lastName}</Dialog.Title>
					</div>
					<div>
						<div className={sessionStyles['data-display']}>
							<div className={sessionStyles.content}>
								<div>
									<p className={sessionStyles.label}>Services</p>
									<p className={sessionStyles.data}>{tutor?.tutoringService.join(', ')}</p>
								</div>
								<div>
									<p className={sessionStyles.label}>Tutorial Type</p>
									<p className={sessionStyles.data}>{tutor?.tutorialType.join(', ')}</p>
								</div>
								<div className="col-span-full">
									<p className={styles.label}>Topics</p>
									{tutor?.topics.map(t => (
										<div key={t[0]} className="my-2 odd:bg-gray-100 px-4">
											<p className='font-medium'>{t[0]}</p>
											<p className="text-sm text-gray-500">Specific Topics: {t[1] || 'None'}</p>
										</div>
									))}
								</div>
								<div className="col-span-full">
									<p className={styles.label}>Schedule</p>
									<ScheduleDisplay schedule={tutor?.schedule as ISchedule} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} onClick={onClose}>Close</button>
				</div>
			</div>
		</Modal>
	)
}

export default TutorModal
