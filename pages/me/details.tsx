import { GetStaticProps, NextPage } from 'next'
import { FormEventHandler } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/loading-spinner'
import UserLayout from '../../components/user-layout'
import app from '../../lib/axios-config'
import dbConnect from '../../lib/db'
import { toastErrorConfig, toastSuccessConfig } from '../../lib/toast-defaults'
import useUser from '../../lib/useUser'
import Library, { ILib } from '../../models/library'
import { ITutorInfo, IUser } from '../../models/user'

interface TutorDetailsProps {
	types: ILib
	services: ILib
	subjects: ILib
}

const TutorDetails: NextPage<TutorDetailsProps> = ({ types, services, subjects }) => {
	const { user, isLoading, isError, mutate } = useUser()

	const handleSubmit: FormEventHandler = async e => {
		e.preventDefault()
		const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as unknown as ITutorInfo

		try {
			await mutate(app.patch<IUser>('/api/me', values))
			toast.success('Profile Updated!', toastSuccessConfig)
		} catch {
			toast.error('A server error has occured. Please try again.', toastErrorConfig)
		}
	}

	if (isLoading) {
		return <UserLayout><LoadingSpinner className="h-96" /></UserLayout>
	} else if (isError) {
		return <UserLayout><p>An error has occured. Please try again.</p></UserLayout>
	}

	return (
		<UserLayout>
			<form onSubmit={handleSubmit}>
				<div className="shadow overflow-hidden sm:rounded-md">
					<div className="px-4 py-5 bg-white sm:p-6">
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="max-tutee" className="block text-sm font-medium text-gray-700">Max Tutee Count</label>
								<input type="number" name="maxTuteeCount" id="max-tutee" defaultValue={user?.maxTuteeCount}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
							<div className="col-span-6 sm:col-span-4">
								<label htmlFor="tutoring-service" className="block text-sm font-medium text-gray-700">Tutoring Services</label>
								<input type="text" name="tutoringService" id="tutoring-service"
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>
					</div>
					<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
						<input type="reset" className="btn gray py-2 px-4 rounded-md mr-4" />
						<input type="submit" value="Save" className="btn blue py-2 px-4 rounded-md" />
					</div>
				</div>
			</form>
		</UserLayout>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()

	const types = await Library.findById('Tutorial Types', '-__v').lean().exec()
	const services = await Library.findById('Tutoring Services', '-__v').lean().exec()
	const subjects = await Library.findById('Subjects', '-__v').lean().exec()

	return {
		props: {
			types,
			services,
			subjects
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default TutorDetails
