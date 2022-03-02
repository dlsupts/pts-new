import { NextPage } from 'next'

import { FormEventHandler } from 'react'
import UserLayout from '../../components/user-layout'

const TutorPage: NextPage = () => {
	const handleSubmit:FormEventHandler = (e) => {
		e.preventDefault()
	}

	return (
		<UserLayout>
			<form onSubmit={handleSubmit}>
				<div className="shadow overflow-hidden sm:rounded-md">
					<div className="px-4 py-5 bg-white sm:p-6">
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
								<input type="text" name="firstName" id="first-name" autoComplete="given-name"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="middle-name" className="block text-sm font-medium text-gray-700">Middle name</label>
								<input type="text" name="middleName" id="middle-name" autoComplete="middle-name"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
								<input type="text" name="lastName" id="last-name" autoComplete="family-name"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="id-number" className="block text-sm font-medium text-gray-700">ID number</label>
								<input type="number" name="idNumber" id="id-number" autoComplete="id-number"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="terms" className="block text-sm font-medium text-gray-700">Remaining Terms</label>
								<input type="number" name="terms" id="terms"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-3">
								<label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
								<input type="number" name="contact" id="contact" autoComplete="contact-number"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>

							<div className="col-span-6 sm:col-span-3">
								<label htmlFor="url" className="block text-sm font-medium text-gray-700">Facebook Profile URL</label>
								<input type="url" name="url" id="url" autoComplete="contact-number"
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>
					</div>
					<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
						<button
							type="submit"
							className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Save
						</button>
					</div>
				</div>
			</form>
		</UserLayout>
	)
}

export default TutorPage
