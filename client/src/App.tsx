import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserPage } from './pages/users/UserPage.tsx'
import { AppLayout } from './AppLayout.tsx'

const QUERY_CLIENT = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={QUERY_CLIENT}>
      <AppLayout>
        <UserPage />
      </AppLayout>
    </QueryClientProvider>
  )
}
