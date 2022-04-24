FROM node:16-slim as angular-build

WORKDIR /todo-list-front-project

EXPOSE 5000

ENV PATH /todo-list-front-project/node_modules/.bin:$PATH

COPY package.json /todo-list-front-project/package.json
RUN npm install
COPY ./ /todo-list-front-project
RUN npm run build

FROM nginx
COPY --from=angular-build /todo-list-front-project/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 777 /usr/nginx/html/static/
CMD ["nginx", "-g", "deamon off;"]