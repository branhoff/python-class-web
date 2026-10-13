# Runs TypeScript directly on Node 26 via native type-stripping: no build step,
# the image only needs runtime deps and src/. Same image for local and Cloud Run.
FROM node:26-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

# Cloud Run injects PORT; this is the local default.
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", "src/server.ts"]
