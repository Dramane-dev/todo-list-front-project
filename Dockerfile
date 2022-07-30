FROM node:16-alpine as angular-build
WORKDIR /simplytodo-front
COPY ./package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run buildProd

FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=angular-build /simplytodo-front/dist/simplytodo-front /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]