FROM node:latest as angular-build

WORKDIR /todo-list-front

EXPOSE 5000

ENV PATH /todo-list-front/node_modules/.bin:$PATH

COPY package.json /todo-list-front/package.json
RUN npm install
COPY ./ /todo-list-front
RUN npm run build

FROM nginx
COPY --from=angular-build /todo-list-front/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 777 /usr/nginx/html/static/
CMD ["nginx", "-g", "deamon off;"]