import { Flex, Layout } from 'antd'
import {Outlet} from "react-router";

export const AppLayout = () => {
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
          <Outlet />
        </Flex>
      </Layout.Content>
    </Layout>
  )
}
