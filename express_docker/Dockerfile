FROM node:18

WORKDIR /usr/src/express_app

COPY ./package.json .
COPY ./package-lock.json .

RUN apt-get update && apt-get install -y dockerize

RUN npm install

COPY . .

EXPOSE 3001

CMD dockerize -wait tcp://mongodb:27017 -timeout 60s npm start
