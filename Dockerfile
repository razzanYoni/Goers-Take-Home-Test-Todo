FROM node:20.15.0-alpine

WORKDIR /goers-blog/be-rest

COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN npx prisma generate
RUN yarn build

COPY . .


CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]
