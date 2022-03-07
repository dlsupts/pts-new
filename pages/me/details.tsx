import { GetStaticProps, NextPage } from 'next'
import { FormEventHandler, useRef } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/loading-spinner'
import UserLayout from '../../components/user-layout'
import app from '../../lib/axios-config'
import dbConnect from '../../lib/db'
import { toastErrorConfig, toastSuccessConfig } from '../../lib/toast-defaults'
import useUser from '../../lib/useUser'
import Library, { ILib } from '../../models/library'
import { ITutorInfo, IUser } from '../../models/user'
import Multiselect from 'multiselect-react-dropdown'
import { days, times, timeComparator, timeslot } from '../../lib/times'
import useSWR from 'swr'
import { ISchedule } from '../../models/schedule'

interface TutorDetailsProps {
	types: ILib
	services: ILib
	subjects: ILib
}

function blockEnterKeyPress(e: KeyboardEvent) {
	if (e.key == 'Enter') e.preventDefault()
}

function useSchedule() {
	const { data, error } = useSWR('/api/me/schedule', url => app.get<ISchedule>(url))
	return {
		schedule: data?.data,
		isLoading: !data && !error,
		isError: !!error
	}
}

function handleScheduleSelect(selectedList: timeslot[]) {
	selectedList.sort(timeComparator)
	console.log(selectedList)
}

// no other options can accompany 'None'
function handleServiceSelect(selectedList: string[], selectedItem: string) {
	if (selectedItem == 'None') {
		selectedList.length = 0
		selectedList.push('None')
	} else {
		const idx = selectedList.findIndex(i => i == 'None')
		if (idx != -1) selectedList.splice(idx, 1)
	}
}

const TutorDetails: NextPage<TutorDetailsProps> = ({ types, services, subjects }) => {
	const { user, isLoading, isError, mutate } = useUser()
	const serviceSelection = useRef<Multiselect>(null)
	const typeSelection = useRef<Multiselect>(null)
	const { schedule, isLoading: isScheduleLoading } = useSchedule()

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
							<div className="col-span-full ">
								<p className="text-lg font-bold">Details</p>
								<p className="text-gray-500 text-sm">Fill in your preferences regarding your sessions</p>
							</div>
							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="max-tutee" className="block text-sm font-medium text-gray-700">Max Tutee Count</label>
								<input type="number" min={0} name="maxTuteeCount" id="max-tutee" defaultValue={user?.maxTuteeCount}
									className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
							<div className="col-span-6 sm:col-span-4">
								<label htmlFor="tutoring-service_input" className="block text-sm font-medium text-gray-700">Tutoring Services</label>
								<Multiselect
									ref={serviceSelection}
									isObject={false}
									selectedValues={user?.tutoringService}
									options={services.content.map(t => t.split(': ')[1])}
									closeOnSelect={false}
									id="tutoring-service"
									avoidHighlightFirstOption={true}
									placeholder="Add"
									closeIcon="cancel"
									onKeyPressFn={blockEnterKeyPress}
									onSelect={handleServiceSelect}
								/>
							</div>
							<div className="col-span-full">
								<label htmlFor="tutorial-types_input" className="block text-sm font-medium text-gray-700">Tutorial Types</label>
								<Multiselect
									isObject={false}
									selectedValues={user?.tutorialType}
									options={types.content.map(t => t.split(': ')[1])}
									closeOnSelect={false}
									id="tutorial-types"
									avoidHighlightFirstOption={true}
									placeholder="Add"
									closeIcon="cancel"
									onKeyPressFn={blockEnterKeyPress}
									ref={typeSelection}
								/>
							</div>
							<div className="col-span-full mt-8">
								<p className="text-lg font-bold">Subject List</p>
								<p className="text-gray-500 text-sm">Select the subjects that you want to teach</p>
							</div>
							<div className="col-span-full mt-8">

							</div>
							<div className="col-span-full mt-8">
								<p className="text-lg font-bold">Availability</p>
								<p className="text-gray-500 text-sm">Select the timeslots where you are available</p>
							</div>
							{days.map(day => (
								<div className="col-span-6" key={day.key}>
									<label htmlFor={day.key + '_input'} className="block text-sm font-medium text-gray-700">{day.text}</label>
									<Multiselect
										isObject={false}
										selectedValues={schedule?.[day.key]}
										options={times}
										closeOnSelect={false}
										id={day.key}
										avoidHighlightFirstOption={true}
										placeholder="Add"
										closeIcon="cancel"
										onSelect={handleScheduleSelect}
										onKeyPressFn={blockEnterKeyPress}
										ref={typeSelection}
									/>
								</div>
							))
							}
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
