import { FC } from 'react'
import { Switch } from '@headlessui/react'

type SwitchProps = {
	isChecked: boolean
	onChange: () => void
	label?: string
}

const MySwitch: FC<SwitchProps> = ({ isChecked, onChange, label }) => (
	<Switch checked={isChecked} onChange={onChange} className={`${isChecked ? 'bg-blue-600' : 'bg-gray-200'} transition-colors relative inline-flex h-6 w-11 items-center rounded-full`}>
		{label != undefined && <span className="sr-only">{label}</span>}
		<span
			className={`${isChecked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform transition-all rounded-full bg-white`}
		/>
	</Switch>
)

export default MySwitch
