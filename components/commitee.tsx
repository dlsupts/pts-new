import { FC } from 'react'
import Image from 'next/image'
import { ICommittee, IOfficer } from '@models/committee'

const OfficerTile: FC<Omit<IOfficer, 'userType'>> = ({ position, image, name }) => {
	let fullPosition = position

	switch (position) {
		case 'EVP': fullPosition = 'Executive Vice President'; break
		case 'VP': fullPosition = 'Vice President'; break
		case 'AVP': fullPosition = 'Associate Vice President'; break
	}

	return (
		<div className="grid place-items-center w-48 mx-8">
			<Image src={'https://drive.google.com/thumbnail?export=view&id=' + image} alt="picture" width={150} height={150} />
			<p className="text-center font-bold mt-1">{name}</p>
			<p className="text-center text-sm">{fullPosition}</p>
		</div>
	)
}

const CommiteeDiv: FC<Omit<ICommittee, '_id'>> = ({ name, officers }) => {
	return (
		<div className="my-8 border-2 py-6 rounded-md">
			<p className="text-center text-3xl mb-4">{name}</p>
			<div className="flex items-start justify-around flex-wrap">
				{officers.map((o, i) => (
					<>
						<OfficerTile
							key={o.user.toString()}
							user={o.user}
							name={o.name}
							position={o.position}
							image={o.image} />
						{/* newline break the flex wrap for every 3 */}
						{(i + 1) % 3 == 0 && <hr className="basis-full border-none lg:block hidden" />}
					</>
				))}
			</div>
		</div>
	)
}

export default CommiteeDiv
