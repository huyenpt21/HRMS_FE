FROM node:16-alpine3.14 as builder

#Install Yarn
RUN npm i -g corepack
WORKDIR /app

ADD ./package.json /app
ADD .env /app/.env
RUN yarn install
ADD . /app

EXPOSE 3000
RUN yarn build
CMD yarn start
