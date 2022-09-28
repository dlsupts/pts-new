import Modal from '.'
import { signOut } from 'next-auth/react'
import app from '@lib/axios-config'
import { Dialog } from '@headlessui/react'
import styles from '@styles/Modal.module.css'
import { useState } from 'react'
import LoadingButton from '@components/loading-button'
import useUser from '@lib/useUser'

export default function MembershipModal() {
	const [isLoading, setIsLoading] = useState(false)
	const [phrase, setPhrase] = useState('')
	const { mutate } = useUser()

	async function updateMembership(membership: boolean) {
		setIsLoading(true)
		await mutate(app.patch('/api/me', { membership, reset: false }))
		if (!membership) signOut()
		setIsLoading(false)
	}

	return (
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		<Modal isOpen={true} close={() => { }}>
			<div className={styles.panel}>
				<div className={styles['confirmation-body']}>
					<Dialog.Title className="text-xl text-center">Do you wish to retain your membership at Peer Tutors Society?</Dialog.Title>
					<div className="w-full px-8">
						<label htmlFor="verify" className="text-xs">If not, enter the phrase &ldquo;leave Peer Tutors Society&rdquo; before the No button enables.</label>
						<input id="verify" type="text" value={phrase} onChange={e => setPhrase(e.target.value)} />
					</div>
					<div className={styles['btn-group']}>
						<LoadingButton className={styles.btn + ' btn gray'}
							onClick={() => updateMembership(false)}
							disabled={phrase != 'leave Peer Tutors Society'}
							isLoading={isLoading}
						>
							No
						</LoadingButton>
						<LoadingButton
							className={styles.btn + ' btn blue'}
							onClick={() => updateMembership(true)}
							isLoading={isLoading}
						>
							Yes
						</LoadingButton>
					</div>
				</div>
			</div>
		</Modal>
	)
}
