FROM node:16-alpine
ARG API_BASE_URL
ENV API_URL ${API_BASE_URL}
WORKDIR /app
COPY . /app
RUN set -x \
  && yarn install --no-audit \
  && yarn build \
  && yarn export

FROM nginx:1.17.9-alpine
COPY --from=0 /app/out /usr/share/nginx/html
RUN sed -i '/index  index.html index.htm;/a try_files $uri $uri/ /index.html =404;' /etc/nginx/conf.d/default.conf
