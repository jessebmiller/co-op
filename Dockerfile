FROM node

RUN npm install -g truffle

RUN mkdir /app
WORKDIR /app

#COPY ./package.json ./package.json
#COPY ./package-lock.json ./package-lock.json