import type { ReactNode } from 'react'
import { Flex, Layout } from 'antd'

interface LayoutProps {
  children: ReactNode
}

export const LunchAppLayout = ({ children }: LayoutProps) => {
  return (
    <Layout style={{ minHeight: '100vh', padding: '0' }}>
      <Layout.Header />
      <Layout.Content>
        <Flex
          gap={100}
          align="center"
          justify="center"
          style={{ width: '100%', paddingTop: '60px' }}
        >
          {children}
        </Flex>
      </Layout.Content>
    </Layout>
  )
}
