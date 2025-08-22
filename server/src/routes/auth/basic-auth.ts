import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import fastifyBasicAuth from '@fastify/basic-auth'

const authenticate = { realm: 'Lunch app' }

export const basicAuthPlugin = fp((fastify, _, done) => {
  const users = [fastify.appConfig.user, fastify.appConfig.admin]

  const validate = async (
    username: string,
    password: string,
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const user = users.find(
      user => user.username === username && user.password === password,
    )

    if (!user) {
      reply.unauthorized('Invalid credentials')
      return
    }

    req.user = {
      username: user.username,
      role: user.role,
    }
  }

  fastify.register(fastifyBasicAuth, { validate, authenticate })

  done()
})

export const requireRole =
  (requiredRole: string) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user?.role !== requiredRole) {
      reply.forbidden('Insufficient permissions')
    }
  }
