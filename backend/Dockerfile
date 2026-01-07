FROM node:18-alpine

WORKDIR /usr/src/app

# install deps first for better caching
COPY package*.json ./
RUN npm ci --production

# copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
