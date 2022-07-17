FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL='http://localhost:3000'
ENV WDS_SOCKET_PORT='5000'

RUN npm install

CMD [ "npm", "start" ]