FROM node:20 AS dev

WORKDIR /app

COPY package.json .

RUN yarn install

COPY src/. src/.
COPY public/. src/.
COPY next.config.ts .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY tailwind.config.ts .

CMD ["yarn", "dev"]

FROM node:20

WORKDIR /app

COPY package.json .

RUN yarn install

COPY src/. src/.
COPY public/. src/.
COPY next.config.ts .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY tailwind.config.ts .

RUN yarn build

CMD ["yarn", "start"]
