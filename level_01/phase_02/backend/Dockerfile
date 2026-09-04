FROM node:22-alpine

WORKDIR /app

# 1. Install dependencies first (Docker caches this layer)
COPY package*.json ./
RUN npm i

# 2. Copy the rest of your code
COPY . .

# 3. Port used by backend (index.js defaults to 3000)
EXPOSE 3000

# 4. Start the backend server
CMD [ "node", "index.js" ]
