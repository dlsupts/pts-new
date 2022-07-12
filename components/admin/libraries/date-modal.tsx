import Modal, { IModalProps } from '@components/modal'
import { Dialog } from '@headlessui/react'
import { FC, useEffect, useRef } from 'react'
import * as yup from 'yup'
import styles from '@styles/Modal.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IDate } from '@models/date'
import cn from 'classnames'

const dateModalSchema = yup.object({
	_id: yup.string().required('Title is required.'),
	start: yup.string().required('Start date is required.'),
	end: yup.string().required('End date is required.'),
})

export type DateModalSchema = yup.InferType<typeof dateModalSchema>

type DateModalProps = IModalProps & {
	date?: IDate
	onSubmit: (data: DateModalSchema) => Promise<void>
	onDelete: () => void
}

const DateModal: FC<DateModalProps> = ({ isOpen, onClose, onSubmit, date, onDelete }) => {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<DateModalSchema>({
		resolver: yupResolver(dateModalSchema)
	})

	const startDate = watch('start') // to set minimum end date

	function resetForm() {
		reset({
			_id: date?._id ?? '',
			start: (date?.start ? new Date(date?.start) : new Date()).toLocaleDateString('en-CA'),
			end: (date?.end ? new Date(date?.end) : new Date()).toLocaleDateString('en-CA')
		})
	}

	useEffect(resetForm, [date, reset, isOpen])

	return (
		<Modal isOpen={isOpen} close={onClose}>
			<div className={styles.panel}>
				<div className={styles.body}>
					<div className={styles['title-container']}>
						<Dialog.Title as="h3" className={styles.title}>{date?._id ?? 'New Date'}</Dialog.Title>
						<button className={styles['delete-btn'] + ' btn red'} onClick={onDelete}>Delete</button>
					</div>
					<form id="add-date" onSubmit={handleSubmit(onSubmit)} className="grid gap-y-1">
						<div className={cn({ 'hidden': date })}>
							<label htmlFor="title">Title</label>
							<input type="text" {...register('_id')} id="title" />
							<p className="form-err-msg text-sm">{errors._id?.message}</p>
						</div>
						<div>
							<label htmlFor="start-date">Start Date</label>
							<input type="date" {...register('start')} id="start-date" />
							<p className="form-err-msg text-sm">{errors.start?.message}</p>
						</div>
						<div>
							<label htmlFor="end-date">End Date</label>
							<input type="date" {...register('end')} id="end-date" min={startDate} />
							<p className="form-err-msg text-sm">{errors.end?.message}</p>
						</div>
					</form>
				</div>
				<div className={styles.footer}>
					<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={onClose}>Cancel</button>
					<button form="add-date" className={styles.btn + ' btn blue'}>{date ? 'Update' : 'Add'}</button>
				</div>
			</div>
		</Modal>
	)
}

export default DateModal
