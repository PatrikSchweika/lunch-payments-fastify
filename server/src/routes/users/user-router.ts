import type {
  ZodTypeProvider,
  FastifyPluginCallbackZod,
} from 'fastify-type-provider-zod'
import { UserContracts } from './user-contracts.js'
import { UserDb } from '../../database/models/user.js'
import { requireRole } from '../auth/basic-auth.js'
import { AuthUserRole, User } from 'contracts'

const mapUser = (user: UserDb, score: number): User => ({
  id: user.id,
  name: user.name,
  archivedAt: user?.archivedAt ?? undefined,
  score,
})

export const userRouter: FastifyPluginCallbackZod = (fastify, _, done) => {
  const calculateScore = async (user: UserDb) => {
    const paidLunches = await fastify.knex('lunchRecords').where({
      payerId: user.id,
    })

    const paidForConsumers = (
      await Promise.all(
        paidLunches.map(async paidLunch =>
          fastify.knex('lunchConsumers').where({
            lunchRecordId: paidLunch.id,
          }),
        ),
      )
    ).flat()

    const consumedLunches = await fastify.knex('lunchConsumers').where({
      consumerId: user.id,
    })

    return paidForConsumers.length - consumedLunches.length
  }

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.getUsers,
    onRequest: fastify.basicAuth,
    handler: async req => {
      const { filter } = req.query

      let users: UserDb[]

      if (filter === 'archived') {
        users = await fastify.knex('users').whereNotNull('archivedAt')
      } else if (filter === 'active') {
        users = await fastify.knex('users').whereNull('archivedAt')
      } else {
        users = await fastify.knex('users')
      }

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

      const user = await fastify.knex('users').where({ id }).first()

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

      const existingUser = await fastify.knex('users').where({ name }).first()

      if (existingUser) {
        return reply.conflict(`User with name ${name} already exists.`)
      }

      const data = await fastify.knex('users').insert({ name }).returning('*')

      return mapUser(data[0], 0)
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.updateUser,
    onRequest: [fastify.basicAuth, requireRole(AuthUserRole.Admin)],
    handler: async (req, reply) => {
      const { name } = req.body
      const { id } = req.params

      const existingUser = await fastify.knex('users').where({ id }).first()

      if (!existingUser) {
        return reply.notFound(`User with id ${id} not found.`)
      }

      await fastify.knex('users').update({ name }).where({ id })

      const updatedUser = (await fastify.knex('users').where({ id }).first())!

      const score = await calculateScore(updatedUser)

      return mapUser(updatedUser, score)
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.archiveUser,
    onRequest: [fastify.basicAuth, requireRole(AuthUserRole.Admin)],
    handler: async (request, reply) => {
      const { id } = request.params

      const user = await fastify.knex('users').where({ id }).first()

      if (!user) {
        return reply.notFound(`User with id ${id} not found.`)
      }

      await fastify
        .knex('users')
        .update({ archivedAt: new Date().toISOString() })
        .where({ id })

      return reply.code(204).send()
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.unarchiveUser,
    onRequest: [fastify.basicAuth, requireRole(AuthUserRole.Admin)],
    handler: async (request, reply) => {
      const { id } = request.params

      const user = await fastify.knex('users').where({ id }).first()

      if (!user) {
        return reply.notFound(`User with id ${id} not found.`)
      }

      await fastify.knex('users').update({ archivedAt: null }).where({ id })

      return reply.code(204).send()
    },
  })

  done()
}
