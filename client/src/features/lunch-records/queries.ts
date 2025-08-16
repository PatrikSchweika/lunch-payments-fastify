import type {
  LunchRecord,
  LunchRecordCreate,
} from 'contracts/src/models/lunch-record.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from 'contracts/src/models/user.ts'
import { API_CLIENT } from '../../setup/api-client.ts'

const createLunchRecord = async (data: LunchRecordCreate) => {
  await API_CLIENT.post('api/lunchRecords', data)
}

const fetchUserLunchRecords = async (userId: User['id']) => {
  return await API_CLIENT.get<LunchRecord[]>(
    `api/users/${userId}/lunchRecords`,
  ).then(res => res.data)
}

const fetchLunchRecords = async () => {
  return await API_CLIENT.get<LunchRecord[]>(`api/lunchRecords`).then(
    res => res.data,
  )
}

const deleteLunchRecord = async (lunchRecordId: LunchRecord['id']) => {
  await API_CLIENT.delete(`api/lunchRecords/${lunchRecordId}`)
}

export const useUserLunchRecords = (userId: User['id']) =>
  useQuery({
    queryKey: ['users', userId, 'lunch-records'],
    queryFn: () => fetchUserLunchRecords(userId),
  })

export const useLunchRecords = () =>
  useQuery({
    queryKey: ['lunch-records'],
    queryFn: fetchLunchRecords,
  })

export const useCreateLunchRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLunchRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['lunch-records'] })
    },
  })
}

export const useDeleteLunchRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLunchRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['lunch-records'] })
    },
  })
}
