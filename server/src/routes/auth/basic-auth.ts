import { FastifyReply, FastifyRequest } from 'fastify'
import { APP_CONFIG } from '../../configuration/app-config.js'

const USERS = [APP_CONFIG.user, APP_CONFIG.admin]

export const AUTHENTICATE = { realm: 'Lunch app' }

export const validate = async (
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

export const requireRole =
  (requiredRole: string) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user?.role !== requiredRole) {
      reply.forbidden('Insufficient permissions')
      return
    }
  }
