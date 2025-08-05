import type {
  ZodTypeProvider,
  FastifyPluginCallbackZod,
} from 'fastify-type-provider-zod'
import { DATABASE } from '../../database/db.js'
import { UserContracts } from './user-contracts.js'

export const userRouter: FastifyPluginCallbackZod = (fastify, _, done) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.createUser,
    handler: async req => {
      const { name } = req.body

      const data = await DATABASE('users').insert({ name }).returning('*')

      return data[0]
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.getUsers,
    handler: async () => {
      return DATABASE('users').select('*')
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.deleteUser,
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
