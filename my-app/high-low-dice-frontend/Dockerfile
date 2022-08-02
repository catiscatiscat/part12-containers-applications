FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV REACT_APP_BACKEND_URL='http://localhost:8080/api'
ENV REACT_APP_SOCKETIO_URL='http://localhost:8080'
ENV REACT_APP_SOCKETIO_PATH='/api/socket.io'
ENV PORT=3001

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html