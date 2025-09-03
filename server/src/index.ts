import path from 'node:path'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifySensible from '@fastify/sensible'
import fastify from 'fastify'

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { appConfigPlugin, Environment } from './configuration/app-config.js'
import { userRouter } from './routes/users/user-router.js'
import { lunchRecordRouter } from './routes/lunch-records/lunch-record-router.js'
import { authRouter } from './routes/auth/auth-router.js'
import { knexPlugin } from './database/knex-plugin.js'
import { basicAuthPlugin } from './routes/auth/basic-auth.js'

const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySensible)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Lunch app',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

await app.register(appConfigPlugin)
app.register(knexPlugin)

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})

app.register(basicAuthPlugin)
app.register(authRouter)
app.register(userRouter)
app.register(lunchRecordRouter)

if (app.appConfig.environment === Environment.Production) {
  app.register(fastifyStatic, {
    root: path.join(import.meta.dirname, '../public'),
    wildcard: false,
  })

  app.get('/*', { schema: { hide: true } }, (_, reply) => {
    return reply.sendFile('index.html')
  })
} else {
  app.get('/*', { schema: { hide: true } }, (request, reply) => {
    return reply.redirect(
      `${request.protocol}://${request.hostname}:5173${request.originalUrl}`,
    )
  })
}

await app.ready()

app.listen(
  { port: app.appConfig.port, host: app.appConfig.host },
  (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`Server listening at ${address}`)
  },
)
