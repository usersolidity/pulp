FROM node:16

# RUN apk update && apk upgrade && apk add git openssh curl

WORKDIR /usr/app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY package*.json ./
RUN npm install

COPY src/ /user/app/

CMD [ "npm", "start" ]
