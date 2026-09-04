FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --no-audit

COPY . .

EXPOSE 2000

CMD [ "node", "index.js" ]
