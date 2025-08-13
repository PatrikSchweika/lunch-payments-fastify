import { useCreateUser, useUsers } from './queries.ts'
import { UserTable } from './UserTable.tsx'
import { AddLunchRecordForm } from '../lunch-records/AddLunchRecordForm.tsx'
import { CreateUserForm } from './CreateUserForm.tsx'

export const UserPage = () => {
  const { data } = useUsers()
  const { mutate: createUser } = useCreateUser()

  return (
    <>
      <UserTable users={data ?? []} />
      <AddLunchRecordForm users={data ?? []} onSubmit={console.log} />
      <CreateUserForm onSubmit={createUser} />
    </>
  )
}
