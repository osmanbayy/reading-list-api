### BASE IMAGE FOR BUILDING ####
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm build
RUN pnpm prune --prod

### PRODUCTION IMAGE ###
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose default nesjts port
EXPOSE 3000

USER node

# Start the app
CMD ["node", "dist/main.js"]