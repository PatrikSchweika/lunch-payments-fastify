FROM node:24 AS base

FROM base AS build

WORKDIR /app
RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --frozen-lockfile

COPY package.json .
COPY server/package.json server/package.json
COPY contracts/package.json contracts/package.json
COPY client/package.json client/package.json

RUN pnpm install --frozen-lockfile --offline

COPY . .

RUN pnpm build

FROM base AS prod
WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --frozen-lockfile --prod

COPY package.json .
COPY server/package.json server/package.json
COPY contracts/package.json contracts/package.json

RUN pnpm install -r --offline --prod

COPY --from=build /app/contracts/dist contracts/dist
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/server/public server/public

EXPOSE 3000

CMD ["sh", "-c", "node ./server/node_modules/knex/bin/cli.js --knexfile ./server/dist/database/knexfile.js migrate:latest && node ./server/dist/index.js"]