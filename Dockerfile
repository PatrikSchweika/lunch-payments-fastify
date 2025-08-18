FROM node:24 AS base

FROM base AS build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch

COPY package.json .
COPY server/package.json server/package.json
COPY contracts/package.json contracts/package.json
COPY client/package.json client/package.json

RUN pnpm install --offline

COPY . .

RUN pnpm build

EXPOSE 3000

#CMD ["pnpm", "run", "--filter", "server", "knex", "migrate:latest"]
CMD ["pnpm", "start"]

#Production stage
#FROM node:24-alpine AS production
#
#WORKDIR /app
#
#COPY --from=build /app/package.json .
#COPY --from=build /app/server/package.json ./server/package.json
#COPY --from=build /app/client/package.json ./client/package.json
#COPY --from=build /app/contracts/package.json ./contracts/package.json
#COPY --from=build /app/pnpm-workspace.yaml .
#COPY --from=build /app/pnpm-lock.yaml .
#COPY --from=build /root/.pnpm-store /root/.pnpm-store
#
#RUN pnpm install -r --offline --prod
#
#COPY --from=build /app/server/dist ./server/dist
#COPY --from=build /app/server/public ./server/public
#
#EXPOSE 3000
#
#CMD ["pnpm", "start"]

#FROM node:24-alpine AS prod
#WORKDIR /app
#
#COPY --from=build /app/server/node_modules /app/node_modules
#COPY --from=build /app/server/dist /app/dist
#COPY --from=build /app/server/public /app/public
#
#EXPOSE 3000
#
#CMD [ "node", "dist/index.js" ]