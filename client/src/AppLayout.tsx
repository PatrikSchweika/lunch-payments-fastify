import { Button, Flex, Layout } from 'antd'
import { Outlet } from 'react-router'
import { useLogout } from './features/auth/queries.ts'

export const AppLayout = () => {
  // todo: add title to Header
  // todo: add Logout to Header

  const { mutate: logout } = useLogout()

  return (
    <Layout style={{ minHeight: '100vh', padding: '0' }}>
      <Layout.Header>
        <Button onClick={() => logout()}>Logout</Button>
      </Layout.Header>
      <Layout.Content>
        <Flex
          gap={100}
          align="center"
          justify="center"
          style={{ width: '100%', paddingTop: '60px' }}
        >
          <Outlet />
        </Flex>
      </Layout.Content>
    </Layout>
  )
}
