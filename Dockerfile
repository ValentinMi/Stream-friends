# ── base ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

# ── deps ──────────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── dev ───────────────────────────────────────────────────────────────────────
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "HOST=0.0.0.0 pnpm dev --host 0.0.0.0"]

# ── build ─────────────────────────────────────────────────────────────────────
FROM deps AS build
COPY . .
RUN pnpm build

# ── prod ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS prod
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=deps /app/node_modules /app/node_modules
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server/server.js"]
