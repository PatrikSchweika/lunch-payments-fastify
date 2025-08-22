import type { User, UserCreate } from 'contracts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_CLIENT } from '../../setup/api-client.ts'

type UserFilter = 'all' | 'active' | 'archived'

const fetchUsers = async (filter: UserFilter) => {
  return await API_CLIENT.get<User[]>('api/users', { params: { filter }}).then(res => res.data)
}

const createUser = async (data: UserCreate) => {
  await API_CLIENT.post('api/users', data)
}

const archiveUser = async (userId: User['id']) => {
  await API_CLIENT.delete(`api/users/${userId}`)
}

export const useUsers = (filter: UserFilter = 'all') =>
  useQuery({
    queryKey: ['users', filter],
    queryFn: () => fetchUsers(filter),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useArchiveUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
