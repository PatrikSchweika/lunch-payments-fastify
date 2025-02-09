import { useQuery } from '@tanstack/react-query'
import type { User } from 'contracts/src/models/user.ts'

const fetchUsers = async () => {
	return await fetch('api/users')
		.then((res) => res.text())
		.then((res) => JSON.parse(res) as User[])
}

const usePing = () =>
	useQuery({
		queryKey: ['users'],
		queryFn: fetchUsers,
	})

export const Welcome = () => {
	const { data } = usePing()

	return (
		<>
			<div>Welcome: {data?.map((user) => user.name).join(', ')}</div>
		</>
	)
}
