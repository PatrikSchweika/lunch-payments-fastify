FROM node:24 AS base
RUN corepack enable

FROM base AS build
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --frozen-lockfile

COPY package.json .
COPY server/package.json server/package.json
COPY contracts/package.json contracts/package.json
COPY client/package.json client/package.json

RUN pnpm install --frozen-lockfile --offline

COPY . .

RUN pnpm build
RUN pnpm deploy --filter server --prod /prod/server

FROM base AS prod
WORKDIR /prod/server

COPY --from=build /prod/server /prod/server

EXPOSE 3000

CMD ["sh", "-c", "pnpm run knex:prod migrate:latest && pnpm start"]