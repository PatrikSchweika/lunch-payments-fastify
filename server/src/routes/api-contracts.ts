import { USER_SCHEMA } from 'contracts/src/models/user.js'
import { z } from 'zod/v4'

export const ApiContracts = {
  users: {
    getUsers: {
      method: 'GET',
      url: '/api/users',
      schema: {
        response: {
          200: z.array(USER_SCHEMA),
        },
        tags: ['User'],
        summary: 'Get all users',
      },
    },
    createUser: {
      method: 'POST',
      url: '/api/users',
      schema: {
        body: z.object({
          name: USER_SCHEMA.shape.name,
        }),
        response: {
          201: USER_SCHEMA,
        },
        tags: ['User'],
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
        tags: ['User'],
        summary: 'Delete user',
      },
    },
  },
}
