import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Welcome } from './Welcome.tsx'

const QUERY_CLIENT = new QueryClient()

export const App = () => {
	return (
		<QueryClientProvider client={QUERY_CLIENT}>
			<Welcome />
		</QueryClientProvider>
	)
}
