import { Dispatch, FC, SetStateAction, HTMLAttributes } from 'react'

type SubjectListProps = {
	subjects: string[][]
	setSubjects: Dispatch<SetStateAction<string[][]>> | ((sub: string[][]) => void)
} & HTMLAttributes<HTMLDivElement>

const SubjectList: FC<SubjectListProps> = ({ subjects, setSubjects, ...props }) => {
	return (
		<div {...props}>
			{subjects.length <= 0 ?
				<p className="text-center text-red-500 py-2">No Subjects Added</p>
				:
				subjects.map(t => (
					<div className="py-2 border-b flex justify-between items-stretch" key={t[0]}>
						<div>
							<p className="font-medium">{t[0]}</p>
							<p className="text-gray-500 text-sm">Specific topics: {t[1] || 'None'}</p>
						</div>
						<div className="btn mr-8 grid place-items-center text-gray-500 hover:text-gray-600 w-8"
							onClick={() => setSubjects(subjects.filter(s => s[0] !== t[0]))}>
							<i className="fa-solid fa-trash fa-lg" />
						</div>
					</div>
				))
			}
		</div>
	)
}

export default SubjectList
