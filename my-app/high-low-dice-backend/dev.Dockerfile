FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

ENV SOCKETIO_CORS_ORIGIN='http://localhost:3001'

RUN npm install

ENV DEBUG=todo-backend:*

USER node

CMD ["npm", "run", "dev"]
