import { CreateUserForm } from './CreateUserForm.tsx'
import { useCreateUser, useUsers } from '../users/queries.ts'
import { UserTable } from '../users/UserTable.tsx'

export const AdminPage = () => {
  // todo: delete users
  // todo: delete lunch records
  // todo: add users

  const { mutate: createUser } = useCreateUser()
  const { data: users } = useUsers()

  return (
    <>
      <UserTable users={users ?? []} onDelete={console.log} />
      <CreateUserForm onSubmit={createUser} />
    </>
  )
}
