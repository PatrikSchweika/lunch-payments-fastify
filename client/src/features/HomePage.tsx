import { useCreateUser, useArchiveUser, useUsers } from './users/queries.ts'
import { UserTable } from './users/UserTable.tsx'
import { AddLunchRecordForm } from './lunch-records/AddLunchRecordForm.tsx'
import { App, Col, Row } from 'antd'
import { CenteredSpin } from '../atoms/CenteredSpin.ts'
import { useCreateLunchRecord } from './lunch-records/queries.ts'
import type { LunchRecordCreate } from 'contracts'
import { useIsAdmin } from './auth/queries.ts'
import { CreateUserForm } from './users/CreateUserForm.tsx'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'

export const HomePage = () => {
  const { message } = App.useApp()

  const isAdmin = useIsAdmin()
  const { data: users, isPending } = useUsers(isAdmin ? 'all' : 'active')
  const { mutateAsync: createLunchRecord } = useCreateLunchRecord()
  const { mutate: archiveUser } = useArchiveUser()
  const { mutate: createUser } = useCreateUser()

  const handleLunchRecordSubmit = async (data: LunchRecordCreate) => {
    await createLunchRecord(data)
    await message.success('Lunch record added 🍔')
  }

  const breakpoints = useBreakpoint()

  if (isPending) {
    return <CenteredSpin size="large" />
  }

  const colSpans = isAdmin ? [9, 8, 7] : [13, 11]

  const maxWidth = isAdmin ? '1200px' : '800px'

  return (
    <Row
      gutter={breakpoints['md'] ? [32, 0] : 0}
      style={{ width: '100%', maxWidth }}
    >
      <Col xs={24} md={colSpans[0]}>
        <UserTable
          users={users ?? []}
          onDelete={isAdmin ? archiveUser : undefined}
        />
      </Col>

      <Col xs={24} md={colSpans[1]}>
        <AddLunchRecordForm
          users={users ?? []}
          onSubmit={handleLunchRecordSubmit}
        />
      </Col>

      {isAdmin && (
        <Col xs={24} md={colSpans[2]}>
          <CreateUserForm onSubmit={createUser} />
        </Col>
      )}
    </Row>
  )
}
