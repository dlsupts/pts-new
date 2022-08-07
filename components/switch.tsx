import { FC } from 'react'
import { Switch } from '@headlessui/react'

type SwitchProps = {
	isChecked: boolean
	onChange: () => void
	label?: string
}

const MySwitch: FC<SwitchProps> = ({ isChecked, onChange, label }) => (
	<Switch checked={isChecked} onChange={onChange} className={`${isChecked ? 'bg-blue-600' : 'bg-gray-200'} h-6 w-11 relative 
		inline-flex items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out 
		focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-opacity-75`
	}>
		{label != undefined && <span className="sr-only">{label}</span>}
		<span
			className={`${isChecked ? 'translate-x-5' : 'translate-x-1'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
		/>
	</Switch>
)

export default MySwitch
