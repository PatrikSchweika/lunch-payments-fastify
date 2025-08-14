import { useCreateUser, useUsers } from './queries.ts'
import { UserTable } from './UserTable.tsx'
import { AddLunchRecordForm } from '../lunch-records/AddLunchRecordForm.tsx'
import { App } from 'antd'
import { CenteredSpin } from '../../atoms/CenteredSpin.ts'
import { CreateUserForm } from './CreateUserForm.tsx'
import { useCreateLunchRecord } from '../lunch-records/queries.ts'
import type { LunchRecordCreate } from 'contracts/src/models/lunch-record.ts'

export const UserPage = () => {
  const { message } = App.useApp()

  const { data, isPending } = useUsers()
  const { mutate: createUser } = useCreateUser()
  const { mutateAsync: createLunchRecord } = useCreateLunchRecord()

  const handleLunchRecordSubmit = async (data: LunchRecordCreate) => {
    await createLunchRecord(data)
    await message.success('Lunch record added 🍔')
  }

  if (isPending) {
    return <CenteredSpin size="large" />
  }

  return (
    <>
      <UserTable users={data ?? []} />
      <AddLunchRecordForm
        users={data ?? []}
        onSubmit={handleLunchRecordSubmit}
      />
      <CreateUserForm onSubmit={createUser} />
    </>
  )
}
