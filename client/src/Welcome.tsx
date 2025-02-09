import { useQuery } from '@tanstack/react-query'
import {Contract} from "contracts/src/contract.ts";

const usePing = () =>
	useQuery({
		queryKey: ['users'],
		queryFn: () => fetch('api/users').then((res) => res.text()),
	})

export const Welcome = () => {
	const { data } = usePing()

	return (
		<>
			<div>Welcome: {data}</div>
			<div>Contract: {Contract.a}</div>
		</>
	)
}
