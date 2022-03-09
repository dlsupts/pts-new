import { GetStaticProps, NextPage } from 'next'
import { FormEventHandler } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/loading-spinner'
import UserLayout from '../../components/user-layout'
import app from '../../lib/axios-config'
import dbConnect from '../../lib/db'
import { toastErrorConfig, toastSuccessConfig } from '../../lib/toast-defaults'
import useUser from '../../lib/useUser'
import Library from '../../models/library'
import { IUserInfo, IUser } from '../../models/user'

const TutorPage: NextPage<{ courses: string[] }> = ({ courses }) => {
	const { user, isLoading, isError, mutate } = useUser()

	const handleSubmit: FormEventHandler = async e => {
		e.preventDefault()
		const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as unknown as IUserInfo

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
								<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
								<input type="text" name="firstName" id="first-name" autoComplete="given-name" defaultValue={user?.firstName}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="middle-name" className="block text-sm font-medium text-gray-700">Middle name</label>
								<input type="text" name="middleName" id="middle-name" autoComplete="middle-name" defaultValue={user?.middleName}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
								<input type="text" name="lastName" id="last-name" autoComplete="family-name" defaultValue={user?.lastName}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="id-number" className="block text-sm font-medium text-gray-700">ID number</label>
								<input type="number" name="idNumber" id="id-number" autoComplete="id-number" defaultValue={user?.idNumber}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="course" className="block text-sm font-medium text-gray-700">Degree Program</label>
								<select name="course" id="course" autoComplete="course" defaultValue={user?.course}
									className="form-select mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
									{courses.map(c => <option key={c}>{c}</option>)}
								</select>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="terms" className="block text-sm font-medium text-gray-700">Remaining Terms</label>
								<input type="number" name="terms" id="terms" defaultValue={user?.terms}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-3">
								<label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
								<input type="tel" name="contact" id="contact" autoComplete="contact-number" defaultValue={user?.contact}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-3">
								<label htmlFor="url" className="block text-sm font-medium text-gray-700">Facebook Profile URL</label>
								<input type="url" name="url" id="url" autoComplete="contact-number" defaultValue={user?.url}
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
	const courses = await Library.getDegreeCodes()

	return {
		props: {
			courses
		}
	}
}

export default TutorPage
