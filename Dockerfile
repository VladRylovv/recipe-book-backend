FROM node:alpine as watch
WORKDIR /recipe-book-backend
COPY . .
RUN npm install
RUN npm run watch
