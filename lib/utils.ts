export function matchPath(pathname: string, route: string) {
	return route === '/' ? pathname === route : pathname.startsWith(route)
}