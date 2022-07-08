import { NextPage } from 'next'
import useSWR from 'swr'
import AdminLayout from '../../components/admin-layout'
import Committee from '../../components/admin/commitee'
import app from '../../lib/axios-config'
import { ICommittee } from '../../models/committee'

function useCommittees() {
	const { data } = useSWR('/api/committees', url => app.get<ICommittee[]>(url))

	return {
		committees: data?.data,
	}
}

const OfficerPage: NextPage = () => {
	const { committees } = useCommittees()

	return (
		<AdminLayout>
			{committees?.map(c => <Committee key={c.name} committee={c} />)}
		</AdminLayout>
	)
}

export default OfficerPage
