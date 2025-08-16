import type {
  ZodTypeProvider,
  FastifyPluginCallbackZod,
} from 'fastify-type-provider-zod'
import { DATABASE } from '../../database/db.js'
import { UserContracts } from './user-contracts.js'
import { UserDb } from '../../database/models/user.js'
import { requireRole } from '../auth/basic-auth.js'
import { AuthUserRole, User } from 'contracts'

const mapUser = (user: UserDb, score: number): User => ({
  id: user.id,
  name: user.name,
  score,
})

const calculateScore = async (user: UserDb) => {
  const paidLunches = await DATABASE('lunchRecords').where({
    payerId: user.id,
  })

  const paidForConsumers = (
    await Promise.all(
      paidLunches.map(async paidLunch =>
        DATABASE('lunchConsumers').where({
          lunchRecordId: paidLunch.id,
        }),
      ),
    )
  ).flat()

  const consumedLunches = await DATABASE('lunchConsumers').where({
    consumerId: user.id,
  })

  return paidForConsumers.length - consumedLunches.length
}

export const userRouter: FastifyPluginCallbackZod = (fastify, _, done) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.getUsers,
    onRequest: fastify.basicAuth,
    handler: async () => {
      const users = await DATABASE('users').select('*')

      return Promise.all(
        users.map(async user => {
          const score = await calculateScore(user)

          return mapUser(user, score)
        }),
      )
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.getUser,
    onRequest: fastify.basicAuth,
    handler: async (req, reply) => {
      const { id } = req.params

      const user = await DATABASE('users').where({ id }).first()

      if (!user) {
        return reply.notFound(`User with id ${id} not found.`)
      }

      const score = await calculateScore(user)

      return mapUser(user, score)
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.createUser,
    onRequest: [fastify.basicAuth, requireRole(AuthUserRole.Admin)],
    handler: async (req, reply) => {
      const { name } = req.body

      const existingUser = await DATABASE('users').where({ name }).first()

      if (existingUser) {
        return reply.conflict(`User with name ${name} already exists.`)
      }

      const data = await DATABASE('users').insert({ name }).returning('*')

      return mapUser(data[0], 0)
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.deleteUser,
    onRequest: [fastify.basicAuth, requireRole(AuthUserRole.Admin)],
    handler: async (request, reply) => {
      const { id } = request.params

      const user = await DATABASE('users').where({ id }).first()

      if (!user) {
        return reply.notFound(`User with id ${id} not found.`)
      }

      await DATABASE('users').where({ id }).delete()

      return reply.code(204).send()
    },
  })

  done()
}
