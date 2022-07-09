import Image from 'next/image'
import { FC } from 'react'
import { ICommittee, IOfficer } from '@models/committee'
import { PlusCircleIcon } from '@heroicons/react/solid'

type OfficerProp = {
	officer: IOfficer
	onOfficerClick: () => void
}

const Officer: FC<OfficerProp> = ({ officer, onOfficerClick }) => {
	return (
		<div
			className="flex justify-between items-center border-gray-400 border px-4 p-2 rounded-lg cursor-pointer transition-shadow hover:shadow-md"
			onClick={onOfficerClick}
		>
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
	onOfficerClick: (officerIdx: number) => void
}

const Committee: FC<CommitteeProps> = ({ committee, onAddClick, onOfficerClick }) => {
	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<p className="text-2xl text-blue-700 font-bold">{committee.name}</p>
				<button onClick={onAddClick}><PlusCircleIcon className="text-gray-400 hover:text-gray-500 active:text-gray-600 transition-colors w-7 aspect-square" /></button>
			</div>
			<div className="grid lg:grid-cols-3 gap-x-4 gap-y-2">
				{committee.officers.map((o, i) => <Officer key={o.user as string} officer={o} onOfficerClick={() => onOfficerClick(i)} />)}
			</div>
		</div>
	)
}

export default Committee
