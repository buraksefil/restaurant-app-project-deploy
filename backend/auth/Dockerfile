FROM node:20 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]