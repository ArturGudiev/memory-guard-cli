# API for Memory Guard original. Talks to the remote MongoDB.
FROM node:20-bookworm

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx tsc

ENV PORT=3033
EXPOSE 3033

CMD ["node", "bld/src/server.js"]
