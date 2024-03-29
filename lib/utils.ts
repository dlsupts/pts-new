import axios from 'axios'
import { toast } from 'react-toastify'
import { toastErrorConfig } from './toast-defaults'
import { IDate } from '@models/date'

export function matchPath(pathname: string, route: string, isHome?: boolean) {
	return isHome ? pathname === route : pathname.startsWith(route)
}

/**
 * filters the selected subjects
 * 
 * @param subjects - original list of subjects
 * @param selected - list of selected subjects along with specific topics, therefore a 2d array
 * @returns list of subjects with the selected subjects filtered out
 */
export function filterSubjects(subjects: string[], selected?: string[][]) {
	const temp = subjects.filter(sub => {
		const temp = sub.split(':')[0].trimStart()
		return !selected?.find(s => s[0] == temp)
	})
	return temp
}

/**
 * Uses binary search to efficiently insert a subject into a sorted list of subjects
 * 
 * @param subjects - list of selected subjects with specific topics
 * @param toInsert - subject, with specific topic, to insert into selected subjects list
 */
export function binInsert(subjects: string[][] | undefined, toInsert: string[]) {
	if (subjects) {
		let lo = 0, hi = subjects.length, mid: number

		while (lo < hi) {
			mid = Math.floor((lo + hi) / 2)

			if (subjects[mid][0] > toInsert[0]) {
				hi = mid
			} else {
				lo = mid + 1
			}
		}

		subjects.splice(lo, 0, toInsert)
	}
}

const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }

/**
 * Standard date formatter for the application.
 * @param date - a date object or date string to format
 * @returns a string equivalent of the date in the form 'MMM DD, YYYY'
 */
export function formatDate(date: Date | string) {
	if (typeof date == 'string') {
		date = new Date(date)
	}

	return date.toLocaleDateString('en-US', dateOptions)
}

/**
 * Formats date objects to ISO format for use is HTML attributes
 * @param date - a date object to format
 * @returns a string equivalent of the date in the form 'YYYY-MM-DD'
 */
export function formatToISODate(date?: Date | string | number) {
	if (!date) return ''
	if (typeof date == 'string' || typeof date == 'number') return new Date(date).toLocaleDateString('sv')
	return date.toLocaleDateString('sv')
}

/**
 * Used to parse keyed library objects.
 * @param content - a string in the form "key: value"
 * @returns an array with the first element being the key and the second being the value.
 */
export function parseContent(content: string) {
	const i = content.indexOf(':')
	return [content.slice(0, i), content.slice(i + 1)]
}

/**
 * Used to show the error message in a toast
 * @param error - an error object of unknown type
 */
export function toastAxiosError(error: unknown) {
	if (axios.isAxiosError(error)) {
		toast.error(error.message, toastErrorConfig)
	}
}

/**
 * Checks to see if the current date is still 14 days before the set term request deadline.
 * @param deadline the deadline for term requests
 * @returns true if the whole term is still an avaiable option
 */
export function isWholeTermStillAvailable(deadline?: IDate['end']) {
	if (!deadline) return true
	return new Date(deadline).getTime() - new Date().getTime() >= 1_209_600_000 // 14 days in milliseconds
}
