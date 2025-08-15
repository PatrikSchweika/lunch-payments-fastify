import { Typography } from 'antd'
import { CreateUserForm } from './CreateUserForm.tsx'
import { useCreateUser } from '../users/queries.ts'

export const AdminPage = () => {
  // todo: delete users
  // todo: delete lunch records
  // todo: add users

  const { mutate: createUser } = useCreateUser()

  return (
    <>
      <Typography>Admin page</Typography>
      <CreateUserForm onSubmit={createUser} />
    </>
  )
}
