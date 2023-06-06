FROM node:18

WORKDIR /usr/src/express_app

COPY ./package.json .
COPY ./package-lock.json .

RUN apt-get update && apt-get install -y wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

RUN npm install

COPY . .

EXPOSE 3001

CMD dockerize -wait tcp://mongodb:27017 -timeout 60s npm start
