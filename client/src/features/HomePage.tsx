import {
  useCreateUser,
  useArchiveUser,
  useUsers,
  useUnarchiveUser,
} from './users/queries.ts'
import { UserTable } from './users/UserTable.tsx'
import { AddLunchRecordForm } from './lunch-records/AddLunchRecordForm.tsx'
import { App, Col, Row, Space, Switch, Typography } from 'antd'
import { CenteredSpin } from '../atoms/CenteredSpin.ts'
import { useCreateLunchRecord } from './lunch-records/queries.ts'
import type { LunchRecordCreate, User, UserCreate } from 'contracts'
import { useIsAdmin } from './auth/queries.ts'
import { CreateUserForm } from './users/CreateUserForm.tsx'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'
import { useState } from 'react'

export const HomePage = () => {
  const isAdmin = useIsAdmin()

  return isAdmin ? <AdminHomePage /> : <UserHomePage />
}

const useLunchRecordSubmit = () => {
  const { message } = App.useApp()
  const { mutateAsync: createLunchRecord } = useCreateLunchRecord()

  return async (data: LunchRecordCreate) => {
    await createLunchRecord(data)
    message.success('Lunch record added 🍔')
  }
}

const UserHomePage = () => {
  const { data: activeUsers, isPending } = useUsers('active')

  const handleLunchRecordSubmit = useLunchRecordSubmit()

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
  const { modal, message } = App.useApp()

  const { data: activeUsers, isPending } = useUsers('active')
  const { data: archivedUsers } = useUsers('archived')
  const [showActiveUsers, setShowActiveUsers] = useState(true)

  const { mutate: archiveUser } = useArchiveUser()
  const { mutate: unarchiveUser } = useUnarchiveUser()
  const { mutateAsync: createUser } = useCreateUser()

  const handleLunchRecordSubmit = useLunchRecordSubmit()

  const handleArchiveUser = async (user: User) => {
    const confirmed = await modal.confirm({
      title: 'Delete confirmation',
      content: (
        <Typography>
          Are you sure you want to archive <strong>{user.name}</strong>?
        </Typography>
      ),
    })

    if (confirmed) {
      archiveUser(user.id)
    }
  }

  const handleUnarchiveUser = (user: User) => {
    unarchiveUser(user.id)
  }

  const handleCreateUser = async (data: UserCreate) => {
    await createUser(data)
    message.success('User created')
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
      <Col xs={24} md={11}>
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
            onUnarchive={handleUnarchiveUser}
          />
        </Space>
      </Col>

      <Col xs={24} md={7}>
        <AddLunchRecordForm
          users={activeUsers ?? []}
          onSubmit={handleLunchRecordSubmit}
        />
      </Col>

      <Col xs={24} md={6}>
        <CreateUserForm onSubmit={handleCreateUser} />
      </Col>
    </Row>
  )
}
