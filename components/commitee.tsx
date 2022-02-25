import { FC } from 'react'
import Image from 'next/image'
import { ICommittee, IOfficer } from '../models/committee'

const OfficerTile: FC<IOfficer> = ({ position, image }) => {
	return (
		<div>
			<Image src={'https://drive.google.com/thumbnail?export=view&id=' + image} alt="picture" width={150} height={150} />
			<p className="text-center">{position}</p>
		</div>
	)
}

const CommiteeDiv: FC<ICommittee> = ({ name, officers }) => {
	return (
		<div className="my-12">
			<p className="text-center text-2xl font-light mb-2">{name}</p>
			<hr />
			<div className="grid grid-flow-col place-items-center mt-4">
				{officers.map(o => <OfficerTile key={o.account.toString()} account={o.account} position={o.position} image={o.image} />)}
			</div>
		</div>
	)
}

export default CommiteeDiv
