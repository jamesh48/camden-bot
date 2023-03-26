# Install dependencies only when needed
FROM node:lts-alpine AS deps

WORKDIR /opt/camden-app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
# This is where because may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
FROM node:lts-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/camden-app
COPY . .
COPY --from=deps /opt/camden-app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner

ARG X_TAG
WORKDIR /opt/camden-app
ENV NODE_ENV=production
COPY --from=builder /opt/camden-app/next.config.js ./
COPY --from=builder /opt/camden-app/public ./public
COPY --from=builder /opt/camden-app/build ./build
COPY --from=builder /opt/camden-app/package*.json ./
COPY --from=builder /opt/camden-app/node_modules ./node_modules

EXPOSE 80
ENV PORT 80
CMD ["npm", "start"]