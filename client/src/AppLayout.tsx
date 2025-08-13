import type { ReactNode } from 'react'
import { Flex } from 'antd'

interface LayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: LayoutProps) => {
  return (
    <Flex
      gap={100}
      align="center"
      justify="center"
      style={{ width: '100%', paddingTop: '60px' }}
    >
      {children}
    </Flex>
  )
}
