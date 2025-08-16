import {
  API_ERROR_MESSAGE_SCHEMA,
  API_VALIDATION_ERROR_MESSAGE_SCHEMA,
  USER_CREATE_SCHEMA,
  USER_SCHEMA,
} from 'contracts'
import { z } from 'zod/v4'

export const UserContracts = {
  getUsers: {
    method: 'GET',
    url: '/api/users',
    schema: {
      response: {
        200: z.array(USER_SCHEMA),
        401: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Users'],
      summary: 'Get all users',
    },
  },

  getUser: {
    method: 'GET',
    url: '/api/users/:id',
    schema: {
      params: z.object({
        id: z.coerce.number(),
      }),
      response: {
        200: USER_SCHEMA,
        400: API_VALIDATION_ERROR_MESSAGE_SCHEMA,
        401: API_ERROR_MESSAGE_SCHEMA,
        404: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Users'],
      summary: 'Get user',
    },
  },

  createUser: {
    method: 'POST',
    url: '/api/users',
    schema: {
      body: USER_CREATE_SCHEMA,
      response: {
        201: USER_SCHEMA,
        400: API_VALIDATION_ERROR_MESSAGE_SCHEMA,
        401: API_ERROR_MESSAGE_SCHEMA,
        403: API_ERROR_MESSAGE_SCHEMA,
        409: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Users'],
      summary: 'Create user',
    },
  },

  deleteUser: {
    method: 'DELETE',
    url: '/api/users/:id',
    schema: {
      params: z.object({
        id: z.coerce.number(),
      }),
      response: {
        204: z.void(),
        400: API_VALIDATION_ERROR_MESSAGE_SCHEMA,
        401: API_ERROR_MESSAGE_SCHEMA,
        403: API_ERROR_MESSAGE_SCHEMA,
        404: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Users'],
      summary: 'Delete user',
    },
  },
}
