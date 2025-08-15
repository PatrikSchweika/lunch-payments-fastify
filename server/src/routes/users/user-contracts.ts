import { USER_CREATE_SCHEMA, USER_SCHEMA } from 'contracts/src/models/user.js'
import { z } from 'zod/v4'

export const UserContracts = {
  getUsers: {
    method: 'GET',
    url: '/api/users',
    schema: {
      response: {
        200: z.array(USER_SCHEMA),
      },
      tags: ['Users'],
      summary: 'Get all users',
    },
  },

  createUser: {
    method: 'POST',
    url: '/api/users',
    schema: {
      body: USER_CREATE_SCHEMA,
      response: {
        201: USER_SCHEMA,
        409: z.void(),
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
        404: z.void(),
      },
      tags: ['Users'],
      summary: 'Delete user',
    },
  },
}
