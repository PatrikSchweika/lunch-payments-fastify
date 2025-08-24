import { useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useCallback, useEffect } from 'react'
import { AxiosError } from 'axios'
import { API_ERROR_MESSAGE_SCHEMA } from 'contracts'

export const useQueryErrorNotificationEffect = () => {
  const { message } = App.useApp()

  const queryClient = useQueryClient()

  const handleError = useCallback(
    (error: AxiosError) => {
      const data = error.response?.data

      const result = API_ERROR_MESSAGE_SCHEMA.safeParse(data)

      if (result.success) {
        message.error(result.data.message)
      } else {
        message.error(JSON.stringify(data))
      }
    },
    [message],
  )

  useEffect(() => {
    const unsubscribeMutation = queryClient
      .getMutationCache()
      .subscribe(event => {
        if (event.mutation?.state.status === 'error') {
          const error = event.mutation.state.error

          if (error instanceof AxiosError) {
            handleError(error)
          }
        }
      })

    const unsubscribeQuery = queryClient.getQueryCache().subscribe(event => {
      if (event.query.state.status === 'error') {
        const error = event.query.state.error

        if (error instanceof AxiosError) {
          handleError(error)
        }
      }
    })

    return () => {
      unsubscribeMutation()
      unsubscribeQuery()
    }
  }, [queryClient, handleError])
}
