import type { LunchRecordCreate } from 'contracts/src/models/lunch-record.ts'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const createLunchRecord = async (data: LunchRecordCreate) => {
  await axios.post('api/lunchRecords', data)
}

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
