import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { User, UserCreate } from 'contracts/src/models/user.ts'
import { CreateUserForm } from './CreateUserForm.tsx'

const fetchUsers = async () => {
  return (await fetch('api/users').then(res => res.json())) as User[]
}

const createUser = async (data: UserCreate) => {
  await fetch('api/users', { method: 'POST', body: JSON.stringify(data) })
}

const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const Welcome = () => {
  const { data } = useUsers()
  const { mutate: createUser } = useCreateUser()

  return (
    <>
      <div>Welcome: {data?.map(user => user.name).join(', ')}</div>

      <CreateUserForm onSubmit={createUser} />
    </>
  )
}
