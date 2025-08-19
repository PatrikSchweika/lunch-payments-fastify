import { Breadcrumb, Button, Flex, Layout, Space, Typography } from 'antd'
import { Link, Outlet, useLocation } from 'react-router'
import { useLogout } from './features/auth/queries.ts'
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

  return (
    <Layout style={{ minHeight: '100vh', padding: '0' }}>
      <Layout.Header
        style={{
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'space-between'
        }}
      >
        <Space size={50}>
          <Typography.Title level={2} style={{ color: 'white', margin: '0' }}>
            Lunch app
          </Typography.Title>
        </Space>

        <Flex flex={1} justify="flex-end">
          <Button onClick={() => logout()}>Logout</Button>
        </Flex>
      </Layout.Header>
      <Layout.Content>
        <Flex vertical style={{ padding: '20px 0 0 20px' }}>
          <Breadcrumb items={breadCrumbItems} />
          <Flex gap={100} align="center" justify="center">
            <Outlet />
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  )
}
