FROM node:20.15.0-alpine

WORKDIR /goers-todo/be

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY prisma ./prisma/
COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]

