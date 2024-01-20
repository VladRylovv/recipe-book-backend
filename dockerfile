FROM node:18.10.0

WORKDIR /app

COPY package.json package.json

COPY . .

RUN npm install

EXPOSE 3002

CMD [ "npm", "run", "watch" ]

