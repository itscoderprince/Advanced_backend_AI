FROM node:22-alpine

WORKDIR /app

# 1. Install dependencies first
COPY package*.json .

# 2. Copy your code and env file
COPY . .
RUN npm i

# 3. Expose port 2000
EXPOSE 2000

# 4. Start the server
CMD [ "node", "index.js" ]
