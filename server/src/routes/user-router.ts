import type { FastifyPluginCallback } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DATABASE } from '../database/db.js'
import { USER_SCHEMA, type User } from '../models/user.js'

export const userRouter: FastifyPluginCallback = (fastify, _, done) => {
	fastify.withTypeProvider<ZodTypeProvider>().route({
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
		handler: async (req) => {
			const { name } = req.body

			const data = await DATABASE<User>('users').insert({ name }).returning('*')

			return data[0]
		},
	})

	fastify.withTypeProvider<ZodTypeProvider>().route({
		method: 'GET',
		url: '/api/users',
		schema: {
			response: {
				200: z.array(USER_SCHEMA),
			},
			tags: ['User'],
			summary: 'Get all users',
		},
		handler: async () => {
			return DATABASE<User>('users').select('*')
		},
	})

	fastify.withTypeProvider<ZodTypeProvider>().route({
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
		handler: async (request, reply) => {
			const { id } = request.params

			console.log(id)

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
