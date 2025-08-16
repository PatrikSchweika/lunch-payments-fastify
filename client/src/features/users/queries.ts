import type { User, UserCreate } from 'contracts/src/models/user.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_CLIENT } from '../../setup/api-client.ts'

const fetchUsers = async () => {
  return await API_CLIENT.get<User[]>('api/users').then(res => res.data)
}

const createUser = async (data: UserCreate) => {
  await API_CLIENT.post('api/users', data)
}

const deleteUser = async (userId: User['id']) => {
  await API_CLIENT.delete(`api/users/${userId}`)
}

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
