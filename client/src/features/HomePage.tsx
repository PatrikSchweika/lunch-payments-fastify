import { useCreateUser, useArchiveUser, useUsers } from './users/queries.ts'
import { UserTable } from './users/UserTable.tsx'
import { AddLunchRecordForm } from './lunch-records/AddLunchRecordForm.tsx'
import { App, Col, Row, Space, Switch } from 'antd'
import { CenteredSpin } from '../atoms/CenteredSpin.ts'
import { useCreateLunchRecord } from './lunch-records/queries.ts'
import type { LunchRecordCreate, User } from 'contracts'
import { useIsAdmin } from './auth/queries.ts'
import { CreateUserForm } from './users/CreateUserForm.tsx'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'
import { useState } from 'react'

export const HomePage = () => {
  const isAdmin = useIsAdmin()

  return isAdmin ? <AdminHomePage /> : <UserHomePage />
}

const UserHomePage = () => {
  const { message } = App.useApp()

  const { data: activeUsers, isPending } = useUsers('active')

  const { mutateAsync: createLunchRecord } = useCreateLunchRecord()

  const handleLunchRecordSubmit = async (data: LunchRecordCreate) => {
    await createLunchRecord(data)
    await message.success('Lunch record added 🍔')
  }

  const breakpoints = useBreakpoint()

  if (isPending) {
    return <CenteredSpin size="large" />
  }

  return (
    <Row
      gutter={breakpoints['md'] ? [32, 0] : 0}
      style={{ width: '100%', maxWidth: '800px' }}
    >
      <Col xs={24} md={13}>
        <UserTable users={activeUsers ?? []} />
      </Col>

      <Col xs={24} md={11}>
        <AddLunchRecordForm
          users={activeUsers ?? []}
          onSubmit={handleLunchRecordSubmit}
        />
      </Col>
    </Row>
  )
}

const AdminHomePage = () => {
  const { message, modal } = App.useApp()

  const { data: activeUsers, isPending } = useUsers('active')
  const { data: archivedUsers } = useUsers('archived')
  const [showActiveUsers, setShowActiveUsers] = useState(true)

  const { mutateAsync: createLunchRecord } = useCreateLunchRecord()
  const { mutate: archiveUser } = useArchiveUser()
  const { mutate: createUser } = useCreateUser()

  const handleLunchRecordSubmit = async (data: LunchRecordCreate) => {
    await createLunchRecord(data)
    await message.success('Lunch record added 🍔')
  }

  const handleArchiveUser = async (user: User) => {
    const confirmed = await modal.confirm({
      title: 'Delete confirmation',
      content: `Are you sure you want to archive ${user.name}?`,
    })

    if (confirmed) {
      archiveUser(user.id)
    }
  }

  const breakpoints = useBreakpoint()

  if (isPending) {
    return <CenteredSpin size="large" />
  }

  return (
    <Row
      gutter={breakpoints['md'] ? [32, 0] : 0}
      style={{ width: '100%', maxWidth: '1200px' }}
    >
      <Col xs={24} md={9}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Switch
            checked={showActiveUsers}
            onChange={val => setShowActiveUsers(val)}
            checkedChildren={'Active users'}
            unCheckedChildren={'Archived users'}
          />
          <UserTable
            users={(showActiveUsers ? activeUsers : archivedUsers) ?? []}
            archivedUsers={!showActiveUsers}
            onArchive={handleArchiveUser}
          />
        </Space>
      </Col>

      <Col xs={24} md={8}>
        <AddLunchRecordForm
          users={activeUsers ?? []}
          onSubmit={handleLunchRecordSubmit}
        />
      </Col>

      <Col xs={24} md={7}>
        <CreateUserForm onSubmit={createUser} />
      </Col>
    </Row>
  )
}
