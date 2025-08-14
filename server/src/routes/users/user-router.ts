import type {
  ZodTypeProvider,
  FastifyPluginCallbackZod,
} from 'fastify-type-provider-zod'
import { DATABASE } from '../../database/db.js'
import { UserContracts } from './user-contracts.js'
import { UserDb } from '../../database/models/user.js'
import { User } from 'contracts/src/models/user.js'

const mapUser = (user: UserDb, score: number): User => ({
  id: user.id,
  name: user.name,
  score,
})

export const userRouter: FastifyPluginCallbackZod = (fastify, _, done) => {
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

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...UserContracts.getUsers,
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
    ...UserContracts.createUser,
    handler: async req => {
      const { name } = req.body

      const data = await DATABASE('users').insert({ name }).returning('*')

      return mapUser(data[0], 0)
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
