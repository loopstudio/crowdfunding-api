FROM node:18-alpine3.15 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

USER node

CMD ["node", "dist/main"]
