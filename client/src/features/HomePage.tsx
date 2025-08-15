import { useUsers } from './users/queries.ts'
import { UserTable } from './users/UserTable.tsx'
import { AddLunchRecordForm } from './lunch-records/AddLunchRecordForm.tsx'
import { App } from 'antd'
import { CenteredSpin } from '../atoms/CenteredSpin.ts'
import { useCreateLunchRecord } from './lunch-records/queries.ts'
import type { LunchRecordCreate } from 'contracts/src/models/lunch-record.ts'

export const HomePage = () => {
  const { message } = App.useApp()

  const { data: users, isPending } = useUsers()
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
      <UserTable users={users ?? []} />
      <AddLunchRecordForm
        users={users ?? []}
        onSubmit={handleLunchRecordSubmit}
      />
    </>
  )
}
