# Runs TypeScript directly on Node 26 via native type-stripping: no build step,
# the image only needs runtime deps, src/ and the lesson content. Same image for
# local and Cloud Run.

# Fetch + verify the self-hosted Pyodide runtime in a throwaway stage so curl,
# bzip2 and the download don't bloat the final image.
FROM node:26-slim AS pyodide
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl bzip2 \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /build
COPY scripts/fetch-pyodide.sh ./scripts/
RUN bash scripts/fetch-pyodide.sh vendor/pyodide

FROM node:26-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY content ./content
COPY --from=pyodide /build/vendor ./vendor

# Cloud Run injects PORT; this is the local default.
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", "src/server.ts"]
