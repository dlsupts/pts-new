import { NextPage } from 'next'
import AdminLayout from '@components/admin-layout'
import styles from '@styles/Libraries.module.css'
import { PlusIcon } from '@heroicons/react/outline'
import { formatDate } from '@lib/utils'
import useRetriever, { useRetrieverWithFallback } from '@lib/useRetriever'
import { IDate } from '@models/date'
import { ILib } from '@models/library'
import { useCallback, useMemo, useState } from 'react'
import app from '@lib/axios-config'
import { toastErrorConfig, toastSuccessConfig } from '@lib/toast-defaults'
import { toast } from 'react-toastify'
import LibraryModal from '@components/admin/libraries/library-modal'
import AddLibraryModal, { AddLibrarySchema } from '@components/admin/libraries/add-library-modal'
import DateModal, { DateModalSchema } from '@components/admin/libraries/date-modal'
import ConfirmationModal from '@components/modal/confirmation-modal'
import axios from 'axios'
import MySwitch from '@components/switch'

type button = {
	text: string
	tooltip: string
	onClick: () => void
}

const LibraryPage: NextPage = () => {
	const { data: libraries, mutate: mutateLibraries } = useRetriever<ILib[]>('/api/libraries')
	const { data: dates, mutate: mutateDates } = useRetriever<IDate[]>('/api/dates')
	const { data: isInMaintenance, mutate: mutateIsInMaintenance } = useRetrieverWithFallback<boolean>('/api/maintenance', true)
	const [libIdx, setLibIdx] = useState(0)
	const [date, setDate] = useState<IDate>()
	const [modal, setModal] = useState('')

	function closeModal() { setModal('') }

	async function handleReset() {
		await app.delete('/api/maintenance')
	}

	async function addLibrary(details: AddLibrarySchema) {
		try {
			await mutateLibraries(async () => {
				const { data } = await app.post<ILib>('/api/libraries', details)
				return libraries?.concat(data)
			})
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data, toastErrorConfig)
			}
		}
		closeModal()
	}

	function deleteLibrary() {
		mutateLibraries(async () => {
			await app.delete(`/api/libraries/${libraries?.[libIdx]._id}`)
			closeModal()
			libraries?.splice(libIdx, 1)
			return libraries
		})
	}

	async function updateLibrary(data: string[]) {
		try {
			await mutateLibraries(async () => {
				await app.put(`/api/libraries/${libraries?.[libIdx]._id}`, { content: data })
				if (libraries) libraries[libIdx].content = data
				return libraries
			})
			toast.success('Library updated successfully.', toastSuccessConfig)
		} catch {
			toast.error('A server-side error has occured.', toastErrorConfig)
		}
	}

	async function updateDate(details: DateModalSchema,) {
		try {
			if (date == undefined) {
				await mutateDates(async () => {
					const { data } = await app.post<IDate>('/api/dates', details)
					return dates?.concat([data])
				})
			} else {
				await app.patch(`/api/dates/${date._id}`, details)
				await mutateDates()
			}
			closeModal()
			toast.success('Dates updated!', toastSuccessConfig)
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast.error(err.response?.data, toastErrorConfig)
			}
		}
	}

	async function deleteDate() {
		await app.delete(`/api/dates/${date?._id}`)
		await mutateDates()
		closeModal()
	}

	const panelButtons: readonly button[] = useMemo(() => [
		{
			text: 'Export Database',
			tooltip: 'Download data in JSON and CSV format',
			async onClick() {
				const { data } = await app.get<string>('/api/export')

				const filePath = 'data:application/zip;base64,' + data
				const a = document.createElement('a')
				a.href = filePath
				a.download = 'export.zip'
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
			}
		},
		{
			text: 'Reset Data',
			tooltip: 'Reset data for incoming term',
			onClick() { setModal('reset') }
		},
	] as const, [])

	const handleMaintenanceToggle = useCallback(async () => {
		try {
			const result = await mutateIsInMaintenance(app.put('/api/maintenance', { reset: !isInMaintenance }))
			toast.success(`Successfully ${result ? 'activated' : 'deactivated'} maintenance mode.`, toastSuccessConfig)
		} catch {
			toast.error('A server-side error has occured!')
		}
	}, [mutateIsInMaintenance, isInMaintenance])

	return (
		<AdminLayout>
			<ConfirmationModal isOpen={modal === 'reset'} message="Proceed with term reset?" onActionClick={handleReset} onClose={closeModal} />
			<LibraryModal isOpen={modal === 'library'} onClose={closeModal}
				library={libraries?.[libIdx]} onDelete={() => setModal('del lib')} onUpdate={updateLibrary} />
			<ConfirmationModal isOpen={modal === 'del lib'} message={`Remove ${libraries?.[libIdx]._id} Library?`}
				onClose={() => setModal('library')} onActionClick={deleteLibrary} />
			<AddLibraryModal isOpen={modal === 'add library'} onClose={closeModal} onSubmit={addLibrary} />
			<DateModal isOpen={modal === 'date'} date={date} onClose={closeModal} onSubmit={updateDate} onDelete={() => setModal('del date')} />
			<ConfirmationModal isOpen={modal === 'del date'} message={`Remove ${date?._id} Dates?`}
				onClose={() => setModal('date')} onActionClick={deleteDate} />
			<div className="grid gap-y-8">
				<section>
					<h2 className={styles['section-header']}>Libraries</h2>
					<div className={styles['library-container']}>
						{libraries?.map((l, i) =>
							<div key={l._id} onClick={() => { setLibIdx(i); setModal('library') }}>
								<p>{l._id}</p>
							</div>
						)}
						<div onClick={() => setModal('add library')}>
							<PlusIcon className="w-5 mr-2" />
							<p>Add Library</p>
						</div>
					</div>
				</section>

				<section>
					<h2 className={styles['section-header']}>Dates</h2>
					<div className={styles['library-container']}>
						{dates?.map((d, i) =>
							<div key={d._id} onClick={() => { setDate(dates[i]); setModal('date') }}>
								<p>{d._id}</p>
								<p className="text-gray-500 text-sm">{formatDate(d.start)} - {formatDate(d.end)}</p>
							</div>
						)}
						<div onClick={() => { setDate(undefined); setModal('date') }}>
							<PlusIcon className="w-5 mr-2" />
							<p>Add Date</p>
						</div>
					</div>
				</section>
				<section>
					<h2 className={styles['section-header']}>Admin Panel</h2>
					<div className={styles['library-container']}>
						<div className="flex justify-between group relative" onClick={handleMaintenanceToggle}>
							<p>Maintenance Mode</p>
							{/*eslint-disable-next-line @typescript-eslint/no-empty-function*/}
							<MySwitch isChecked={isInMaintenance} onChange={() => { }} />
							<span className={styles.tooltip + ' group-hover:scale-100'}>Prevent new requests and applications from coming in</span>
						</div>
						<div className="!hidden"></div>
					</div>
					<div className={styles['button-group']}>
						{panelButtons.map(b =>
							<div key={b.text} role="button" className="btn blue group" onClick={b.onClick}>
								<p>{b.text}</p>
								<span className="group-hover:scale-100">{b.tooltip}</span>
							</div>
						)}
					</div>
				</section>
			</div >
		</AdminLayout >
	)
}

export default LibraryPage
