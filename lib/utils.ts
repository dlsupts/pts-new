export function matchPath(pathname: string, route: string) {
	return route === '/' ? pathname === route : pathname.startsWith(route)
}

/**
 * filters the selected subjects
 * 
 * @param subjects original list of subjects
 * @param selected list of selected subjects along with specific topics, therefore a 2d array
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
 * @param subjects list of selected subjects with specific topics
 * @param toInsert subject, with specific topic, to insert into selected subjects list
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
