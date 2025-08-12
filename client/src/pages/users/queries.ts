import axios from 'axios'
import type { User, UserCreate } from 'contracts/src/models/user.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const fetchUsers = async () => {
  return await axios.get<User[]>('api/users').then(res => res.data)
}

const createUser = async (data: UserCreate) => {
  await axios.post('api/users', data)
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
