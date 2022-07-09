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
				<p className="font-medium">{officer?.name}</p>
				<p>{officer.position}</p>
			</div>
			<div className="hidden sm:block">
				<Image src={`https://drive.google.com/uc?export=view&id=${officer.image}`}
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
}

const Committee: FC<CommitteeProps> = ({ committee, onAddClick, onOfficerClick }) => {
	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<p className="text-2xl text-blue-700 font-bold">{committee.name}</p>
				<button onClick={onAddClick}><PlusCircleIcon className="text-gray-400 hover:text-gray-500 active:text-gray-600 transition-colors w-7 aspect-square" /></button>
			</div>
			<div className="grid lg:grid-cols-3 gap-x-4 gap-y-2">
				{committee.officers.map((o, i) => <Officer key={o.user as string} officer={o} onOfficerClick={onOfficerClick(i)} />)}
			</div>
		</div>
	)
}

export default Committee
