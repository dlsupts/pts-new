const tutorialTypes = {
	'One Session': [
		{ value: 'One', text: 'One-on-one' },
		{ value: 'Group', text: 'Group Study' },
	],
	'Whole Term': [
		{ value: 'One-on-one', text: 'I prefer strictly one-on-one tutorials' },
		{ value: 'Small Group (2 - 3)', text: `I'm fine having a tutorial with other students (max. 2)` },
		{ value: 'Group Study', text: 'I have some friends I want to have the tutorial with (max. 2)' },
	]
} as const

export default tutorialTypes