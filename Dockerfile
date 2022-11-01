FROM node:18-alpine3.15 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

USER node

CMD ["node", "dist/main"]
