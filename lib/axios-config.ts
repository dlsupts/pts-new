import axios from 'axios'

const app = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		'Access-Control-Allow-Credentials': 'true',
	},
})

export default app
