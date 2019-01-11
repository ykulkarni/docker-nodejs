FROM node:alpine as builder
WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY . .
CMD ["npm","run", "build"]

FROM nginx
COPY --from=builder /usr/app/build /usr/share/nginx/html
