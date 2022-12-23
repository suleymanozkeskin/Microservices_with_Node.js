## Dockerfile for posts service
## Lets get the node version 19.2.0



FROM node:19.2.0 

WORKDIR /app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]


