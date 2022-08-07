import { GetStaticProps, NextPage } from 'next'
import { FormEventHandler, useRef, MouseEventHandler, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from '@components/loading-spinner'
import UserLayout from '@components/user-layout'
import app from '@lib/axios-config'
import dbConnect from '../../lib/db'
import { toastErrorConfig, toastSuccessConfig } from '@lib/toast-defaults'
import useUser from '@lib/useUser'
import Library from '@models/library'
import { ITutorInfo, IUser } from '@models/user'
import Multiselect from 'multiselect-react-dropdown'
import useSWRImmutable from 'swr/immutable'
import { ISchedule } from '@models/schedule'
import AddSubjectModal from '@components/subject-list/modal'
import SubjectList from '@components/subject-list/list'
import SchedulePicker from '@components/schedule-picker'
import Head from 'next/head'
import { siteTitle } from '@components/layout'

interface TutorDetailsProps {
	types: string[]
	services: string[]
	subjects: string[]
}

function blockEnterKeyPress(e: KeyboardEvent) {
	if (e.key == 'Enter') e.preventDefault()
}

function useSchedule() {
	const { data, error, mutate } = useSWRImmutable('/api/me/schedule', url => app.get<ISchedule>(url).then(res => res.data))
	return {
		sched: data,
		isSchedLoading: !data && !error,
		isSchedError: !!error,
		schedMutate: mutate
	}
}

// no other options can accompany 'None'.
// the function handles removal of invalid accompanying options
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
	const { sched, isSchedLoading, isSchedError, schedMutate } = useSchedule()
	const [isOpen, setIsOpen] = useState(false)	// for add subject modal
	const [selectedSubjects, setSelectedSubjects] = useState<string[][]>([])

	const handleAddClick: MouseEventHandler = e => {
		e.preventDefault()
		setIsOpen(true)
	}

	useEffect(() => { if (user) { setSelectedSubjects(user.topics) } }, [user])

	const handleSubmit: FormEventHandler = async e => {
		e.preventDefault()
		const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as unknown as ITutorInfo
		if (selectedSubjects) values.topics = selectedSubjects
		if (serviceSelection.current) values.tutoringService = serviceSelection.current.getSelectedItems()
		if (typeSelection.current) values.tutorialType = typeSelection.current.getSelectedItems()

		try {
			const tasks = [
				mutate(app.patch<IUser>('/api/me', values).then(res => res.data), {
					optimisticData: { ...user, ...values } as IUser
				}),
				schedMutate(app.post<ISchedule>('/api/me/schedule', sched).then(res => res.data), {
					optimisticData: sched
				})
			]
			await Promise.all(tasks)
			toast.success('Profile Updated!', toastSuccessConfig)
		} catch {
			toast.error('A server error has occured. Please try again.', toastErrorConfig)
		}
	}

	if (isLoading || isSchedLoading) {
		return <UserLayout><LoadingSpinner className="h-96" /></UserLayout>
	} else if (isError || isSchedError) {
		return <UserLayout><p>An error has occured. Please try again.</p></UserLayout>
	} else if (!sched) {
		return <></>
	}

	return (
		<>
			<Head>
				<title>{siteTitle} | Tutor Details</title>
			</Head>
			<AddSubjectModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				options={subjects}
				selected={selectedSubjects}
				setSelected={setSelectedSubjects}
			/>
			<UserLayout>
				<form onSubmit={handleSubmit}>
					<div className="shadow sm:rounded-md overflow-visible">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6 ">
								<div className="col-span-full ">
									<p className="text-lg font-bold">Details</p>
									<p className="text-gray-500 text-sm">Fill in your preferences regarding your sessions</p>
								</div>
								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="max-tutee">Max Tutee Count</label>
									<input type="number" min={0} name="maxTuteeCount" id="max-tutee" defaultValue={user?.maxTuteeCount} />
								</div>
								<div className="col-span-6 sm:col-span-4">
									<label htmlFor="tutoring-service_input">Tutoring Services</label>
									<Multiselect
										ref={serviceSelection}
										isObject={false}
										selectedValues={user?.tutoringService}
										options={services}
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
									<label htmlFor="tutorial-types_input">Tutorial Types</label>
									<Multiselect
										isObject={false}
										selectedValues={user?.tutorialType}
										options={types}
										closeOnSelect={false}
										id="tutorial-types"
										avoidHighlightFirstOption={true}
										placeholder="Add"
										closeIcon="cancel"
										onKeyPressFn={blockEnterKeyPress}
										ref={typeSelection}
									/>
								</div>
								<div className="col-span-full mt-12 flex justify-between items-center">
									<div>
										<p className="text-lg font-bold">Subject List</p>
										<p className="text-gray-500 text-sm">Select the subjects that you want to teach</p>
									</div>
									<button title="Add subject" className="btn gray px-3 py-2 rounded-full" onClick={handleAddClick}>
										<i className="fa-solid fa-plus fa-lg text-white"></i>
									</button>
								</div>
								<div className="col-span-full">
									<SubjectList subjects={selectedSubjects} setSubjects={setSelectedSubjects} />
								</div>
								<div className="col-span-full mt-12">
									<p className="text-lg font-bold">Availability</p>
									<p className="text-gray-500 text-sm">Select the timeslots where you are available</p>
								</div>
								<SchedulePicker sched={sched} />
							</div>
						</div>
						<div className="px-4 py-3 bg-gray-50 text-right sm:px-6 mt-12">
							<input type="reset" className="btn gray py-2 px-4 rounded-md mr-4" />
							<input type="submit" value="Save" className="btn blue py-2 px-4 rounded-md" />
						</div>
					</div>
				</form>
			</UserLayout>
		</>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()

	const types = await Library.findById('Tutorial Types', '-__v').lean().exec()
	const services = await Library.findById('Tutoring Services', '-__v').lean().exec()
	const subjects = await Library.findById('Subjects', '-__v').lean().exec()
	const languages = await Library.findById('Programming Languages', '-__v').lean().exec()

	return {
		props: {
			types: types?.content,
			services: services?.content,
			subjects: subjects?.content?.concat(languages?.content ?? [])
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default TutorDetails
