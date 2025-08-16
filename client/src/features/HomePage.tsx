import { useCreateUser, useDeleteUser, useUsers } from './users/queries.ts'
import { UserTable } from './users/UserTable.tsx'
import { AddLunchRecordForm } from './lunch-records/AddLunchRecordForm.tsx'
import { App } from 'antd'
import { CenteredSpin } from '../atoms/CenteredSpin.ts'
import { useCreateLunchRecord } from './lunch-records/queries.ts'
import type { LunchRecordCreate } from 'contracts/src/models/lunch-record.ts'
import { useIsAdmin } from './auth/queries.ts'
import { CreateUserForm } from './users/CreateUserForm.tsx'

export const HomePage = () => {
  const { message } = App.useApp()

  const isAdmin = useIsAdmin()
  const { data: users, isPending } = useUsers()
  const { mutateAsync: createLunchRecord } = useCreateLunchRecord()
  const { mutate: deleteUser } = useDeleteUser()
  const { mutate: createUser } = useCreateUser()

  const handleLunchRecordSubmit = async (data: LunchRecordCreate) => {
    await createLunchRecord(data)
    await message.success('Lunch record added 🍔')
  }

  if (isPending) {
    return <CenteredSpin size="large" />
  }

  return (
    <>
      <UserTable
        users={users ?? []}
        onDelete={isAdmin ? deleteUser : undefined}
      />
      <AddLunchRecordForm
        users={users ?? []}
        onSubmit={handleLunchRecordSubmit}
      />
      {isAdmin && <CreateUserForm onSubmit={createUser} />}
    </>
  )
}
