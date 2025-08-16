import type {
  FastifyPluginCallbackZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { AuthContracts } from './auth-contracts.js'

export const authRouter: FastifyPluginCallbackZod = (fastify, _, done) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...AuthContracts.getAuthUser,
    onRequest: fastify.basicAuth,
    handler: req => {
      return req.user
    },
  })

  fastify.withTypeProvider<ZodTypeProvider>().route({
    ...AuthContracts.logout,
    onRequest: fastify.basicAuth,
    handler: (req, reply) => {
      req.user = undefined

      reply.unauthorized('Logged out.')
    },
  })

  done()
}
