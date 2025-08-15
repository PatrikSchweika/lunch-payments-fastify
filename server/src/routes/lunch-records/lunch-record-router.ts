import type {
  FastifyPluginCallbackZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { DATABASE } from '../../database/db.js'
import { LunchRecordContracts } from './lunch-record-contracts.js'

export const lunchRecordRouter: FastifyPluginCallbackZod = (
  fastify,
  _,
  done,
) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...LunchRecordContracts.getLunchRecords,
    handler: async () => {
      const lunchRecordEntries = await DATABASE('lunchRecords').select('*')

      return Promise.all(
        lunchRecordEntries.map(async entry => {
          const consumers = await DATABASE('lunchConsumers')
            .where({ lunchRecordId: entry.id })
            .select('consumerId')

          return {
            id: entry.id,
            date: entry.date,
            payerId: entry.payerId,
            description: entry.description,
            consumerIds: consumers.map(consumer => consumer.consumerId),
          }
        }),
      )
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...LunchRecordContracts.getUserLunchRecords,
    handler: async (req, reply) => {
      const { userId } = req.params
      const user = await DATABASE('users').where({ id: userId }).first()

      if (!user) {
        return reply.code(404).send()
      }

      const lunchConsumerEntries = await DATABASE('lunchConsumers')
        .select('*')
        .where({ consumerId: userId })

      const lunchConsumerRecords = await Promise.all(
        lunchConsumerEntries.map(async entry => {
          return (await DATABASE('lunchRecords')
            .select('*')
            .where({ id: entry.lunchRecordId })
            .first())!
        }),
      )

      const lunchPayerEntries = await DATABASE('lunchRecords')
        .select('*')
        .where({ payerId: userId })

      const lunchRecords = [...lunchConsumerRecords, ...lunchPayerEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      return Promise.all(
        lunchRecords.map(async record => {
          const consumers = await DATABASE('lunchConsumers')
            .where({ lunchRecordId: record.id })
            .select('consumerId')

          return {
            id: record.id,
            date: record.date,
            payerId: record.payerId,
            description: record.description,
            consumerIds: consumers.map(consumer => consumer.consumerId),
          }
        }),
      )
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...LunchRecordContracts.createLunchRecord,
    handler: async req => {
      const { date, description, payerId, consumerIds } = req.body

      const lunchRecordDb = await DATABASE('lunchRecords')
        .insert({
          date,
          description,
          payerId,
        })
        .returning('*')

      for (const consumerId of consumerIds) {
        await DATABASE('lunchConsumers').insert({
          lunchRecordId: lunchRecordDb[0].id,
          consumerId,
        })
      }

      return {
        id: lunchRecordDb[0].id,
        ...req.body,
      }
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...LunchRecordContracts.deleteLunchRecord,
    handler: async (request, reply) => {
      const { id } = request.params

      const lunchRecord = await DATABASE('lunchRecords').where({ id }).first()

      if (!lunchRecord) {
        return reply.code(404)
      }

      await DATABASE('lunchRecords').where({ id }).delete()

      return reply.code(204).send()
    },
  })

  done()
}
