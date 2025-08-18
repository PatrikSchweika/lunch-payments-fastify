import { FastifyReply, FastifyRequest } from 'fastify'
import { APP_CONFIG } from '../../configuration/app-config.js'
import fp from 'fastify-plugin'
import fastifyBasicAuth from '@fastify/basic-auth'

const USERS = [APP_CONFIG.user, APP_CONFIG.admin]

const authenticate = { realm: 'Lunch app' }

const validate = async (
  username: string,
  password: string,
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = USERS.find(
    u => u.username === username && u.password === password,
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

export const basicAuthPlugin = fp((fastify, _, done) => {
  fastify.register(fastifyBasicAuth, { validate, authenticate })

  done()
})

export const requireRole =
  (requiredRole: string) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user?.role !== requiredRole) {
      reply.forbidden('Insufficient permissions')
      return
    }
  }
