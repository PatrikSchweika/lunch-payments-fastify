import path from 'node:path'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { APP_CONFIG, Environment } from './configuration/app-config.js'
import { userRouter } from './routes/user-router.js'

const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FastifyApi',
      description: 'Fastify backend service',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})

app.register(userRouter)

if (APP_CONFIG.environment === Environment.Production) {
  app.register(fastifyStatic, {
    root: path.join(path.resolve(), 'public'),
  })

  app.get('/', (_, reply) => {
    // todo: require login

    return reply.sendFile('index.html')
  })
} else {
  app.get('/*', (request, reply) => {
    // todo: path does not start with api
    // todo: require login

    return reply.redirect(
      `${request.protocol}://${request.hostname}:5173${request.originalUrl}`,
    )
  })
}

app.listen({ port: APP_CONFIG.port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})
