import { Dispatch, FC, SetStateAction } from 'react'

interface SubjectListProps {
	subjects: string[][]
	setSubjects: Dispatch<SetStateAction<string[][]>>
}

const SubjectList: FC<SubjectListProps> = ({ subjects, setSubjects }) => {
	if (!subjects.length) {
		return (
			<p className="text-center text-gray-500 py-2">No Subjects Added</p>
		)
	}
	
	return (
		<>
			{subjects.map(t => (
				<div className="py-2 border-b flex justify-between items-stretch" key={t[0]}>
					<div>
						<p className="font-medium">{t[0]}</p>
						<p className="text-gray-500 text-sm">Specific topics: {t[1] || 'None'}</p>
					</div>
					<div className="btn mr-8 grid place-items-center text-gray-500 hover:text-gray-600 w-8"
						onClick={() => setSubjects(subjects.filter(s => s[0] !== t[0]))}>
						<i className="fa-solid fa-trash fa-lg"></i>
					</div>
				</div>
			))}
		</>
	)
}

export default SubjectList
