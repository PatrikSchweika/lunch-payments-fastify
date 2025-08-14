import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from 'antd'

import '@ant-design/v5-patch-for-react-19'
import './setup/zod-errors.ts'
import {AppRouter} from "./AppRouter.tsx";

const QUERY_CLIENT = new QueryClient()

export const LunchApp = () => {
  return (
    <QueryClientProvider client={QUERY_CLIENT}>
      <App>
        <AppRouter />
      </App>
    </QueryClientProvider>
  )
}
