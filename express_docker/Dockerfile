FROM node:18

WORKDIR /usr/src/express_app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]
