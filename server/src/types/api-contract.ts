import { RouteOptions } from 'fastify'

export type ApiContract = Record<string, Omit<RouteOptions, 'handler'>>
