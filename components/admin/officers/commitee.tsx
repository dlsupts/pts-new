import Image from 'next/image'
import { FC, MouseEventHandler, useCallback } from 'react'
import { ICommittee, IOfficer } from '@models/committee'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { XIcon } from '@heroicons/react/outline'

type OfficerProp = {
	officer: IOfficer
	onOfficerClick: (isDelete: boolean) => void
}

const Officer: FC<OfficerProp> = ({ officer, onOfficerClick }) => {
	const handleDelClick: MouseEventHandler = useCallback((e) => {
		e.stopPropagation()
		onOfficerClick(true)
	}, [onOfficerClick])

	return (
		<div
			className="relative flex justify-between items-center border-gray-400 border px-4 p-2 rounded-lg cursor-pointer transition-shadow hover:shadow-md"
			onClick={() => onOfficerClick(false)}
		>
			<XIcon className="aspect-square w-4 absolute top-2 right-2 z-10 hover:bg-gray-500 hover:text-white rounded-full p-0.5 transition-colors" onClick={handleDelClick} />
			<div>
				<p className="font-medium">{officer?.name || 'Null'}</p>
				<p>{officer.position}</p>
			</div>
			<div className="hidden sm:block">
				<Image src={`https://lh3.googleusercontent.com/d/${officer.image}`}
					alt={`Photo of ${officer.name}`}
					width={90}
					height={90}
				/>
			</div>
		</div>
	)
}

type CommitteeProps = {
	committee: ICommittee
	onAddClick: () => void
	onOfficerClick: (officerIdx: number) => (isDelete: boolean) => void
	onDeleteClick: () => void
}

const Committee: FC<CommitteeProps> = ({ committee, onAddClick, onOfficerClick, onDeleteClick }) => {
	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<p className="text-2xl text-blue-700 font-bold">{committee.name}</p>
				<div className="flex items-center space-x-1">
					<PlusCircleIcon onClick={onAddClick} className="text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer transition-colors w-7 aspect-square" />
					<XIcon onClick={onDeleteClick} className="text-white bg-gray-400 hover:bg-gray-500 active:bg-gray-600 rounded-full aspect-square w-6 p-0.5 cursor-pointer" />
				</div>
			</div>
			<div className="grid lg:grid-cols-3 gap-x-4 gap-y-2">
				{committee.officers.length ?
					committee.officers.map((o, i) => <Officer key={o.user as string} officer={o} onOfficerClick={onOfficerClick(i)} />)
					:
					<p className="grid place-items-center col-span-full font-medium h-24 text-gray-500 text-xl">No officers yet</p>
				}
			</div>
		</div>
	)
}

export default Committee
