import { GetStaticProps, NextPage } from 'next'
import { FormEventHandler, useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from '@components/loading-spinner'
import UserLayout from '@components/user-layout'
import app from '@lib/axios-config'
import dbConnect from '@lib/db'
import { toastErrorConfig, toastSuccessConfig } from '@lib/toast-defaults'
import useUser from '@lib/useUser'
import Library from '@models/library'
import { ITutorInfo, IUser } from '@models/user'
import Multiselect from 'multiselect-react-dropdown'
import AddSubjectModal from '@components/subject-list/modal'
import SubjectList from '@components/subject-list/list'
import SchedulePicker from '@components/schedule-picker'
import Head from 'next/head'
import { siteTitle } from '@components/layout'
import LoadingButton from '@components/loading-button'

interface TutorDetailsProps {
	types: string[]
	services: string[]
	subjects: string[]
}

function blockEnterKeyPress(e: KeyboardEvent) {
	if (e.key == 'Enter') e.preventDefault()
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
	const { user, isLoading: isUserLoading, isError, mutate } = useUser()
	const serviceSelection = useRef<Multiselect>(null)
	const typeSelection = useRef<Multiselect>(null)
	const [isOpen, setIsOpen] = useState(false)	// for add subject modal
	const [selectedSubjects, setSelectedSubjects] = useState<string[][]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => { if (user) { setSelectedSubjects(user.topics) } }, [user])

	if (isUserLoading) {
		return <UserLayout><LoadingSpinner className="h-96" /></UserLayout>
	} else if (isError || !user) {
		return <UserLayout><p>An error has occured. Please try again.</p></UserLayout>
	}

	const handleSubmit: FormEventHandler = async e => {
		e.preventDefault()
		setIsLoading(true)
		const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as unknown as ITutorInfo
		if (selectedSubjects) values.topics = selectedSubjects
		if (serviceSelection.current) values.tutoringService = serviceSelection.current.getSelectedItems()
		if (typeSelection.current) values.tutorialType = typeSelection.current.getSelectedItems()
		values.schedule = user.schedule

		try {
			await mutate(app.patch<IUser>('/api/me', values).then(res => res.data), {
				optimisticData: { ...user, ...values } as IUser
			})
			toast.success('Profile Updated!', toastSuccessConfig)
		} catch {
			toast.error('A server error has occured. Please try again.', toastErrorConfig)
		}
		setIsLoading(false)
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
									<input type="number" min={0} name="maxTuteeCount" id="max-tutee" defaultValue={user.maxTuteeCount} />
								</div>
								<div className="col-span-6 sm:col-span-4">
									<label htmlFor="tutoring-service_input">Tutoring Services</label>
									<Multiselect
										ref={serviceSelection}
										isObject={false}
										selectedValues={user.tutoringService}
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
										selectedValues={user.tutorialType}
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
									<button type="button" title="Add subject" className="btn gray px-3 py-2 rounded-full" onClick={() => setIsOpen(true)}>
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
								<SchedulePicker sched={user.schedule} />
							</div>
						</div>
						<div className="px-4 py-3 bg-gray-50 text-right sm:px-6 mt-12">
							<LoadingButton type="submit" className="btn blue py-2 px-4 rounded-md" isLoading={isLoading}>
								Save
							</LoadingButton>
						</div>
					</div>
				</form>
			</UserLayout>
		</>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect()

	const data = await Promise.all([
		Library.findById('Tutorial Types').lean(),
		Library.findById('Tutoring Services').lean(),
		Library.findById('Subjects').lean(),
		Library.findById('Programming Languages').lean(),
	])

	return {
		props: {
			types: data[0]?.content,
			services: data[1]?.content,
			subjects: data[2]?.content?.concat(data[3]?.content ?? [])
		},
	}
}

export default TutorDetails
