FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL='http://localhost:3000'
ENV REACT_APP_SOCKETIO_URL='http://localhost:3000'
ENV REACT_APP_SOCKETIO_PATH='/socket.io'
ENV PORT=3001

RUN npm install

CMD [ "npm", "start" ]