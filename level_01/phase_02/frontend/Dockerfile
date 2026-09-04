FROM node:22-alpine

WORKDIR /app

# 1. Install dependencies first (Docker caches this layer)
COPY package*.json ./
RUN npm i

# 2. Copy the frontend source code
COPY . .

# 3. Expose Vite's default dev server port
EXPOSE 5173

# 4. Start Vite with --host so it is accessible outside the container
CMD [ "npm", "run", "dev", "--", "--host" ]
