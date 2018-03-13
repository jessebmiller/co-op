FROM node

RUN npm install -g truffle

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
COPY package-lock.json pakcage-lock.json

RUN npm install

COPY contracts contracts
COPY installed_contracts installed_contracts
COPY truffle-config.js truffle-config.js
COPY truffle.js truffle.js

RUN truffle compile

COPY . .
