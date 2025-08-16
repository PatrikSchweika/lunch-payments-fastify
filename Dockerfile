FROM node:24-alpine AS builder
WORKDIR /usr/src/app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only package files first (for better caching of dependencies)
COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "run", "start"]