import type { ReactNode } from 'react'
import { Flex } from 'antd'

interface LayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: LayoutProps) => {
  return (
    <Flex vertical align="center" style={{ width: '100%' }}>
      {children}
    </Flex>
  )
}
