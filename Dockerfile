FROM node

RUN npm install -g truffle

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY contracts contracts
COPY installed_contracts installed_contracts
COPY truffle.js truffle.js

RUN truffle compile

COPY . .
