FROM node:16-alpine3.14 as builder
ARG ENV=example

#Install Yarn
RUN npm i -g corepack
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY . /app
COPY .env /app/.env

RUN yarn build

FROM nginx:1.21.6-alpine-perl
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
