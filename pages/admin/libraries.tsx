import { NextPage } from 'next'
import AdminLayout from '@components/admin-layout'
import styles from '@styles/Libraries.module.css'
import { PlusIcon } from '@heroicons/react/outline'
import { formatDate } from '@lib/utils'
import useRetriever from '@lib/useRetriever'
import { IDate } from '@models/date'
import { ILib } from '@models/library'
import { IFAQs } from '@models/faq'
import { Switch } from '@headlessui/react'
import { useMemo, useState } from 'react'

type button = {
	text: string
	tooltip: string
	onClick: () => void
}

const LibraryPage: NextPage = () => {
	const { data: libraries } = useRetriever<ILib[]>('/api/libraries')
	const { data: dates } = useRetriever<IDate[]>('/api/dates')
	const { data: faqs } = useRetriever<IFAQs[]>('/api/faqs')
	const [isInMaintenance, setIsInMaintenance] = useState(false)
	const panelButtons: readonly button[] = useMemo(() => [
		{
			text: 'Export Database',
			tooltip: 'Download data in JSON format',
			onClick() { }
		},
		{
			text: 'Reset Data',
			tooltip: 'Reset data for incoming term',
			onClick() { }
		},
	] as const, [])

	return (
		<AdminLayout>
			<div className="grid gap-y-8">
				<section>
					<h2 className={styles['section-header']}>Libraries</h2>
					<div className={styles['library-container']}>
						{libraries?.map(l =>
							<div key={l._id} className="">
								<p>{l._id}</p>
							</div>
						)}
						<div>
							<PlusIcon className="w-5 mr-2" />
							<p>Add Library</p>
						</div>
					</div>
				</section>

				<section>
					<h2 className={styles['section-header']}>Dates</h2>
					<div className={styles['library-container']}>
						{dates?.map(d =>
							<div key={d._id}>
								<p>{d._id}</p>
								<p className="text-gray-500 text-sm">{formatDate(d.start)} - {formatDate(d.end)}</p>
							</div>
						)}
						<div>
							<PlusIcon className="w-5 mr-2" />
							<p>Add Date</p>
						</div>
					</div>
				</section>

				<section>
					<h2 className={styles['section-header']}>FAQs</h2>
					<div className={styles['library-container']}>
						{faqs?.map(f =>
							<div key={f.type}>
								<p>{f.type}</p>
							</div>
						)}
						<div>
							<PlusIcon className="w-5 mr-2" />
							<p>Add FAQ</p>
						</div>
					</div>
				</section>

				<section>
					<h2 className={styles['section-header']}>Admin Panel</h2>
					<div className={styles['library-container']}>
						<div className="flex justify-between group relative" onClick={() => setIsInMaintenance(b => !b)}>
							<p>Maintenance Mode</p>
							{/*eslint-disable-next-line @typescript-eslint/no-empty-function*/}
							<Switch checked={isInMaintenance} onChange={() => { }} className={`${isInMaintenance ? 'bg-blue-600' : 'bg-gray-200'} transition-colors relative inline-flex h-6 w-11 items-center rounded-full`}>
								<span
									className={`${isInMaintenance ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform transition-all rounded-full bg-white`}
								/>
							</Switch>
							<span className={styles.tooltip + ' group-hover:scale-100'}>Prevent new requests and applications from coming in</span>
						</div>
						<div className="!hidden"></div>
					</div>
					<div className={styles['button-group']}>
						{panelButtons.map(b =>
							<div key={b.text} role="button" className="btn blue group">
								<p>{b.text}</p>
								<span className="group-hover:scale-100">{b.tooltip}</span>
							</div>
						)}
					</div>
				</section>
			</div>
		</AdminLayout>
	)
}

export default LibraryPage
