import { Breadcrumb, Button, Flex, Layout, Typography } from 'antd'
import { Link, Outlet, useLocation } from 'react-router'
import { useIsAdmin, useLogout } from './features/auth/queries.ts'
import { HomeOutlined } from '@ant-design/icons'

const HOME_BREADCRUMB_ITEM = {
  title: (
    <Link to={'/'} replace={true}>
      <HomeOutlined />
    </Link>
  ),
}

export const AppLayout = () => {
  const { mutate: logout } = useLogout()

  const location = useLocation()

  const pathSnippets = location.pathname.split('/').filter(Boolean)

  const routeBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`

    return {
      key: url,
      title: (
        <Link to={url}>
          {snippet.charAt(0).toUpperCase() + snippet.slice(1)}
        </Link>
      ),
    }
  })

  const breadCrumbItems = [HOME_BREADCRUMB_ITEM, ...routeBreadcrumbItems]

  const isAdmin = useIsAdmin()

  return (
    <Layout style={{ minHeight: '100vh', padding: '0' }}>
      <Layout.Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Title level={2} style={{ color: 'white', margin: '0' }}>
          Lunch app {isAdmin ? '- admin' : ''}
        </Typography.Title>

        <Button style={{ color: 'white' }} type="link" onClick={() => logout()}>
          Logout
        </Button>
      </Layout.Header>
      <Layout.Content>
        <Flex vertical gap={10}>
          <Breadcrumb
            style={{ padding: '16px 0 0 16px' }}
            items={breadCrumbItems}
          />
          <Flex justify="center" style={{ padding: '16px' }}>
            <Outlet />
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  )
}
