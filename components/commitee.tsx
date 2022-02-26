import { FC } from 'react'
import Image from 'next/image'
import { ICommittee, IOfficer } from '../models/committee'

const OfficerTile: FC<IOfficer> = ({ position, image, name }) => {
	let fullPosition = position

	switch (position) {
		case 'EVP': fullPosition = 'Executive Vice President'; break
		case 'VP': fullPosition = 'Vice President'; break
		case 'AVP': fullPosition = 'Associate Vice President'; break
	}

	return (
		<div className="grid place-items-center w-48">
			<Image src={'https://drive.google.com/thumbnail?export=view&id=' + image} alt="picture" width={150} height={150} />
			<p className="text-center font-bold mt-1">{name}</p>
			<p className="text-center text-sm">{fullPosition}</p>
		</div>
	)
}

const CommiteeDiv: FC<ICommittee> = ({ name, officers }) => {
	return (
		<div className="my-8 border-2 py-6 rounded-md">
			<p className="text-center text-3xl mb-4">{name}</p>
			<div className="grid md:grid-flow-col gap-y-4 place-items-center mt-4">
				{officers.map(o => (
					<OfficerTile
						key={o.account.toString()}
						account={o.account}
						name={o.name}
						position={o.position}
						image={o.image} />
				))}
			</div>
		</div>
	)
}

export default CommiteeDiv
