FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN npm ci

CMD node index.js