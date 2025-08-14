import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserPage } from './pages/users/UserPage.tsx'
import { LunchAppLayout } from './LunchAppLayout.tsx'
import { App } from 'antd'

import '@ant-design/v5-patch-for-react-19'
import './setup/zod-errors.ts'

const QUERY_CLIENT = new QueryClient()

export const LunchApp = () => {
  return (
    <QueryClientProvider client={QUERY_CLIENT}>
      <App>
        <LunchAppLayout>
          <UserPage />
        </LunchAppLayout>
      </App>
    </QueryClientProvider>
  )
}
