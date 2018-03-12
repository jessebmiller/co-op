FROM node

RUN npm install -g truffle

RUN mkdir /app
WORKDIR /app

