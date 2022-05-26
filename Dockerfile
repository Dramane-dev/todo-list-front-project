FROM node:16-alpine as angular-build
WORKDIR /todo-list-front
COPY ./package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 5001
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=angular-build /todo-list-front/dist/todo-list-front .