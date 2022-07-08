import { FC } from 'react'
import { ICommittee, IOfficer } from '../../models/committee'

const Officer: FC<{ officer: IOfficer }> = ({ officer }) => {
	return (
		<div>
			<p>{officer?.name}</p>
		</div>
	)
}

const Committee: FC<{ committee: ICommittee }> = ({ committee }) => {
	return (
		<div key={committee.name}>
			<p className="text-xl">{committee.name}</p>
			<div className="grid">
				{committee.officers.map(o => <Officer key={o.user as string} officer={o} />)}
			</div>
		</div>
	)
}

export default Committee
