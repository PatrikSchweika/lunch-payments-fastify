import type { User } from 'contracts/src/models/user.js'
import type { FastifyPluginCallback } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DATABASE } from '../database/db.js'
import { ApiContracts } from './api-contracts.js'

export const userRouter: FastifyPluginCallback = (fastify, _, done) => {
	fastify.withTypeProvider<ZodTypeProvider>().route({
		...ApiContracts.users.createUser,
		handler: async (req) => {
			const { name } = req.body

			const data = await DATABASE<User>('users').insert({ name }).returning('*')

			return data[0]
		},
	})

	fastify.withTypeProvider<ZodTypeProvider>().route({
		...ApiContracts.users.getUsers,
		handler: async () => {
			return DATABASE<User>('users').select('*')
		},
	})

	fastify.withTypeProvider<ZodTypeProvider>().route({
		...ApiContracts.users.deleteUser,
		handler: async (request, reply) => {
			const { id } = request.params

			const exists = await DATABASE<User>('users').where({ id }).first()

			if (!exists) {
				return reply.code(404)
			}

			await DATABASE<User>('users').where({ id }).delete()

			return reply.code(204).send()
		},
	})

	done()
}
