ARG NODE_VERSION=16

FROM node:${NODE_VERSION} AS base
MAINTAINER Hanh Nguyen <hanhdz025@gmail.com>
RUN npm i -g pnpm
RUN echo "Node $(node -v) / NPM v$(npm -v) / YARN v$(yarn -v) / PNPM v$(pnpm -v)"

FROM base AS build
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY rollup.config.mjs tsconfig.json ./
COPY src src/
RUN pnpm build

FROM base AS deps
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./
COPY --from=deps /usr/src/app/node_modules ./node_modules/

ENV PORT 3000
EXPOSE ${PORT}
CMD ["node", "main.mjs"]