# Builds the Eleventy site and serves it for Sliplane.
# Listen address is 0.0.0.0. Sliplane routes to the PORT it sets (default 8080).
# Health check: GET /health → 200.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM caddy:2-alpine
RUN apk add --no-cache wget
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/health" || exit 1
