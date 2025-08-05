import type { FastifyPluginCallback } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DATABASE } from '../database/db.js'
import { ApiContracts } from './api-contracts.js'

export const userRouter: FastifyPluginCallback = (fastify, _, done) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...ApiContracts.users.createUser,
    handler: async req => {
      const { name } = req.body

      const data = await DATABASE('users').insert({ name }).returning('*')

      return data[0]
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...ApiContracts.users.getUsers,
    handler: async () => {
      return DATABASE('users').select('*')
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...ApiContracts.users.deleteUser,
    handler: async (request, reply) => {
      const { id } = request.params

      const exists = await DATABASE('users').where({ id }).first()

      if (!exists) {
        return reply.code(404)
      }

      await DATABASE('users').where({ id }).delete()

      return reply.code(204).send()
    },
  })

  done()
}
