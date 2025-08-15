import { AUTH_USER_SCHEMA } from 'contracts/src/models/auth-user.js'
import { API_ERROR_MESSAGE_SCHEMA } from 'contracts/src/models/error.js'

export const AuthContracts = {
  getAuthUser: {
    method: 'GET',
    url: '/api/auth/user',
    schema: {
      response: {
        200: AUTH_USER_SCHEMA,
        401: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Auth'],
      summary: 'Get auth user',
    },
  },
}
