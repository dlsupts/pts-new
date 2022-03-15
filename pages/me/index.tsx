import { GetStaticProps, NextPage } from 'next'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/loading-spinner'
import UserLayout from '../../components/user-layout'
import app from '../../lib/axios-config'
import dbConnect from '../../lib/db'
import { toastErrorConfig, toastSuccessConfig } from '../../lib/toast-defaults'
import useUser from '../../lib/useUser'
import Library from '../../models/library'
import { IUserInfo, IUser, userInfoSchema } from '../../models/user'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'

const TutorPage: NextPage<{ courses: string[] }> = ({ courses }) => {
	const { user, isLoading, isError, mutate } = useUser()
	const { register, handleSubmit, formState: { errors }, reset } = useForm<IUserInfo>({
		reValidateMode: 'onBlur',
		resolver: yupResolver(userInfoSchema),
	})

	// set default values once user has loaded
	useEffect(() => reset(user), [reset, user])

	async function onSubmit(data: IUserInfo) {
		try {
			await mutate(app.patch<IUser>('/api/me', data))
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
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="shadow overflow-hidden sm:rounded-md">
					<div className="px-4 py-5 bg-white sm:p-6">
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="first-name">First name</label>
								<input type="text" {...register('firstName')} id="first-name" autoComplete="given-name" />
								<p className="form-err-msg text-sm">{errors.firstName?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="middle-name">Middle name</label>
								<input type="text" {...register('middleName')} id="middle-name" autoComplete="middle-name" />
								<p className="form-err-msg text-sm">{errors.middleName?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="last-name">Last name</label>
								<input type="text" {...register('lastName')} id="last-name" autoComplete="family-name" />
								<p className="form-err-msg text-sm">{errors.lastName?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="id-number">ID number</label>
								<input type="number" {...register('idNumber')} id="id-number" autoComplete="id-number" />
								<p className="form-err-msg text-sm">{errors.idNumber?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="course">Degree Program</label>
								<select {...register('course')} id="course" autoComplete="course">
									{courses.map(c => <option key={c}>{c}</option>)}
								</select>
								<p className="form-err-msg text-sm">{errors.course?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-2">
								<label htmlFor="terms">Remaining Terms</label>
								<input type="number" {...register('terms')} id="terms" />
								<p className="form-err-msg text-sm">{errors.terms?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-3">
								<label htmlFor="contact">Contact Number</label>
								<input type="tel" {...register('contact')} id="contact" autoComplete="contact-number" />
								<p className="form-err-msg text-sm">{errors.contact?.message}</p>
							</div>

							<div className="col-span-6 sm:col-span-3">
								<label htmlFor="url">Facebook Profile URL</label>
								<input type="url" {...register('url')} id="url" autoComplete="contact-number" />
								<p className="form-err-msg text-sm">{errors.url?.message}</p>
							</div>
						</div>
					</div>
					<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
						<input type="reset" className="btn gray py-2 px-4 rounded-md mr-4" onClick={e => { e.preventDefault(); reset()}} />
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
