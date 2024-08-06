FROM node:17 as builder

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

FROM nginx

COPY --from=builder /app/dist/homeservice_admin /var/www/html

COPY --from=builder /app/infra/nginx/nginx.conf /etc/nginx/nginx.conf

RUN apt-get update && apt-get install -y curl
CMD ["nginx", "-g", "daemon off;"]
