### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY mb-personal-site/package.json ./
RUN npm install
COPY ./mb-personal-site .

RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/mb-personal-website /usr/share/nginx/html