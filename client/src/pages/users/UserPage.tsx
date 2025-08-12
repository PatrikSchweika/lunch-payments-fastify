import { useUsers } from './queries.ts'
import { UserTable } from './UserTable.tsx'
import { AddLunchRecordForm } from '../lunch-records/AddLunchRecordForm.tsx'

export const UserPage = () => {
  const { data } = useUsers()

  return (
    <>
      <UserTable users={data ?? []} />
      <AddLunchRecordForm users={data ?? []} onSubmit={console.log} />
    </>
  )
}
