# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma compatibility
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy application files and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built assets and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

# Wait for DB to accept connections, run migrations, and start the app
CMD ["sh", "-c", "node scripts/wait-for-db.js && npx prisma migrate deploy && npm run start"]
