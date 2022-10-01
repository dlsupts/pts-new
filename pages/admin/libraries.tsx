import { NextPage } from 'next'
import AdminLayout from '@components/admin-layout'
import styles from '@styles/Libraries.module.css'
import { PlusIcon } from '@heroicons/react/outline'
import { formatDate, toastAxiosError } from '@lib/utils'
import { useRetriever } from '@lib/useRetriever'
import { IDate } from '@models/date'
import { ILib } from '@models/library'
import { useCallback, useMemo, useState } from 'react'
import app from '@lib/axios-config'
import { toastErrorConfig, toastSuccessConfig } from '@lib/toast-defaults'
import { toast } from 'react-toastify'
import { AddLibrarySchema } from '@components/admin/libraries/add-library-modal'
import { DateModalSchema } from '@components/admin/libraries/date-modal'
import MySwitch from '@components/switch'
import { siteTitle } from '@components/layout'
import Head from 'next/head'
import LoadingButton from '@components/loading-button'
import dynamic from 'next/dynamic'

const LibraryModal = dynamic(() => import('@components/admin/libraries/library-modal'))
const AddLibraryModal = dynamic(() => import('@components/admin/libraries/add-library-modal'))
const DateModal = dynamic(() => import('@components/admin/libraries/date-modal'))
const ConfirmationModal = dynamic(() => import('@components/modal/confirmation-modal'))

type button = {
	text: string
	tooltip: string
	onClick: () => void
}

const LibraryPage: NextPage = () => {
	const { data: libraries, mutate: mutateLibraries } = useRetriever<ILib[]>('/api/libraries')
	const { data: dates, mutate: mutateDates } = useRetriever<IDate[]>('/api/dates')
	const { data: isInMaintenance, mutate: mutateIsInMaintenance } = useRetriever<boolean>('/api/maintenance', true)
	const [isLoading, setIsLoading] = useState(false)
	const [libIdx, setLibIdx] = useState(0)
	const [date, setDate] = useState<IDate>()
	const [modal, setModal] = useState('')

	function closeModal() { setModal('') }

	async function handleReset() {
		setIsLoading(true)
		try {
			await app.delete('/api/maintenance')
			toast.success('Term data has been reset!', toastSuccessConfig)
			setModal('')
		} catch (err) {
			toastAxiosError(err)
		}
		setIsLoading(false)
	}

	async function addLibrary(details: AddLibrarySchema) {
		try {
			await mutateLibraries(async () => {
				const { data } = await app.post<ILib>('/api/libraries', details)
				return libraries?.concat(data)
			})
		} catch (err) {
			toastAxiosError(err)
		}
		closeModal()
	}

	async function deleteLibrary() {
		await mutateLibraries(async () => {
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
			toastAxiosError(err)
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
				setIsLoading(true)
				const { data } = await app.get<string>('/api/export')

				const filePath = 'data:application/zip;base64,' + data
				const a = document.createElement('a')
				a.href = filePath
				a.download = 'export.zip'
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				setIsLoading(false)
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
			<Head>
				<title>{siteTitle} | Libraries</title>
			</Head>
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
							<LoadingButton key={b.text} role="button" className="btn blue group" onClick={b.onClick} isLoading={isLoading}>
								<p>{b.text}</p>
								<span className="group-hover:scale-100">{b.tooltip}</span>
							</LoadingButton>
						)}
					</div>
				</section>
			</div >
		</AdminLayout >
	)
}

export default LibraryPage
