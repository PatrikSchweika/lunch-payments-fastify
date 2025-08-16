import { API_CLIENT } from '../../setup/api-client.ts'
import { type AuthUser, AuthUserRole } from 'contracts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const fetchAuthUser = () => {
  return API_CLIENT.get<AuthUser>('api/auth/user').then(res => res.data)
}

const logout = () => API_CLIENT.post('api/auth/logout')

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: fetchAuthUser,
  })
}

export const useIsAdmin = () => {
  const { data: authUser } = useAuthUser()

  return authUser?.role === AuthUserRole.Admin
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['auth-user'] }),
    //  onSuccess: async () => {
    //    queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    //    window.location.reload()
    //  },
  })
}
