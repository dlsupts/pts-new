import { GetStaticProps, NextPage } from 'next'
import { FormEventHandler, useRef, MouseEventHandler, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/loading-spinner'
import UserLayout from '../../components/user-layout'
import app from '../../lib/axios-config'
import dbConnect from '../../lib/db'
import { toastErrorConfig, toastSuccessConfig } from '../../lib/toast-defaults'
import useUser from '../../lib/useUser'
import Library from '../../models/library'
import { ITutorInfo, IUser } from '../../models/user'
import Multiselect from 'multiselect-react-dropdown'
import { days, times, timeComparator, timeslot } from '../../lib/times'
import useSWRImmutable from 'swr/immutable'
import { ISchedule } from '../../models/schedule'
import Modal from '../../components/modal'
import { Dialog } from '@headlessui/react'
import { filterSubjects, binInsert } from '../../lib/utils'

interface TutorDetailsProps {
	types: string[]
	services: string[]
	subjects: string[]
}

function blockEnterKeyPress(e: KeyboardEvent) {
	if (e.key == 'Enter') e.preventDefault()
}

function useSchedule() {
	const { data, error, mutate } = useSWRImmutable('/api/me/schedule', url => app.get<ISchedule>(url))
	return {
		sched: data?.data,
		isSchedLoading: !data && !error,
		isSchedError: !!error,
		schedMutate: mutate
	}
}

// sort schedule timeslots every time an option is selected
function handleScheduleSelect(selectedList: timeslot[], key: typeof days[number]['key'], schedule?: ISchedule) {
	selectedList.sort(timeComparator)
	if (schedule) schedule[key] = selectedList // update schedule
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
	const [selectedSubjects, setSelectedSubjects] = useState<string[][]>()
	const newSubject = useRef<HTMLSelectElement>(null)
	const newTopics = useRef<HTMLTextAreaElement>(null)

	const handleAddClick: MouseEventHandler = e => {
		e.preventDefault()
		setIsOpen(true)
	}

	const closeModal = () => setIsOpen(false)

	useEffect(() => { if (user) { setSelectedSubjects(user.topics) } }, [user])

	const addSubject = () => {
		const subject = newSubject?.current?.value || ''
		const topic = newTopics?.current?.value || ''

		// verify if value is in list of subjects
		if (subjects.find(s => s == subject)) {
			const toSave = [subject.split(': ')[0], topic]
			binInsert(selectedSubjects, toSave)
			setSelectedSubjects(selectedSubjects)
		}

		closeModal()
	}

	const handleSubmit: FormEventHandler = async e => {
		e.preventDefault()
		const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as unknown as ITutorInfo
		if (selectedSubjects) values.topics = selectedSubjects
		if (serviceSelection.current) values.tutoringService = serviceSelection.current.getSelectedItems()
		if (typeSelection.current) values.tutorialType = typeSelection.current.getSelectedItems()

		try {
			const tasks = [mutate(app.patch<IUser>('/api/me', values)), schedMutate(app.post<ISchedule>('/api/me/schedule', sched))]
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
	}

	return (
		<>
			<Modal isOpen={isOpen} close={closeModal}>
				<div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div className="mt-3 text-center sm:mt-0 sm:text-left">
								<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">Add Subject</Dialog.Title>
								<div className="mt-4">
									<label htmlFor="new-subject">New Subject</label>
									<select ref={newSubject} id="new-subject">
										{filterSubjects(subjects, selectedSubjects).map(o => <option key={o} value={o}>{o}</option>)}
									</select>
									<label htmlFor="specific-topics" className="mb-1 mt-4">Specific Topics</label>
									<textarea ref={newTopics} id="specific-topics" rows={3} className="shadow-sm w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"></textarea>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse">
						<input value="Add" type="submit" onClick={addSubject} className="blue btn px-4 py-2 shadow-sm sm:w-auto sm:text-sm rounded-md font-medium" />
						<button type="button" onClick={closeModal} className="white btn px-4 py-2 rounded-md shadow-sm font-medium sm:mt-0 sm:w-auto sm:text-sm mx-3" > Cancel </button>
					</div>
				</div>
			</Modal>
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
										options={services.map(t => t.split(': ')[1])}
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
										options={types.map(t => t.split(': ')[1])}
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
									{selectedSubjects?.map(t => (
										<div className="py-2 border-b flex justify-between items-stretch" key={t[0]}>
											<div>
												<p className="font-medium">{t[0]}</p>
												<p className="text-gray-500 text-sm">Specific topics: {t[1] || 'None'}</p>
											</div>
											<div className="btn mr-8 grid place-items-center text-gray-500 hover:text-gray-600 w-8"
												onClick={() => setSelectedSubjects(selectedSubjects.filter(s => s[0] !== t[0]))}>
												<i className="fa-solid fa-trash fa-lg"></i>
											</div>
										</div>
									))}
								</div>
								<div className="col-span-full mt-12">
									<p className="text-lg font-bold">Availability</p>
									<p className="text-gray-500 text-sm">Select the timeslots where you are available</p>
								</div>
								{days.map(day => (
									<div className="col-span-6" key={day.key}>
										<label htmlFor={day.key + '_input'}>{day.text}</label>
										<Multiselect
											isObject={false}
											selectedValues={sched?.[day.key]}
											options={times}
											closeOnSelect={false}
											id={day.key}
											avoidHighlightFirstOption={true}
											placeholder="Add"
											closeIcon="cancel"
											onSelect={s => handleScheduleSelect(s, day.key, sched)}
											onKeyPressFn={blockEnterKeyPress}
										/>
									</div>
								))
								}
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
			subjects: subjects?.content?.concat(languages?.content?.map(l => l.split(':')[1]) ?? [])
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATION_INTERVAL)
	}
}

export default TutorDetails
